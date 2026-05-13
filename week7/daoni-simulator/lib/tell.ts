// Tell 모듈 — 인스타 캡션 + 블로그 글 (Claude) + 시드/라이브 이미지 옵션
import { CROPS, type Crop } from "@/data/crops";
import { QUARTERS } from "@/data/seed-quarters";
import { generateDayState } from "@/data/seed-daily";
import { callClaude, buildDaoniPersonaSystem, type SystemBlock } from "./claude";
import { generateImage } from "./openai";

export type TellContent = {
  instagramCaption: string;
  blogPost: string;
  thumbnailUrl: string;
  imageMode: "seed" | "live";
};

const GUIDELINES = `너는 다온이 — 염창동 옥상농장 자율 운영자.
지정된 작물의 인스타 캡션 + 짧은 블로그 글을 1인칭으로 만든다.

[응답 규칙]
- 반드시 순수 JSON. 마크다운 코드블록(\`\`\`) 금지.
- instagramCaption: 80~120자, 1인칭, 마지막에 한글 해시태그 3~5개.
- blogPost: 200~300자, 1인칭, 시즌·동네·단골 톤 살리기.

[응답 스키마]
{
  "instagramCaption": "...",
  "blogPost": "..."
}`;

function stripJsonFence(s: string): string {
  return s
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function buildImagePrompt(crop: Crop): string {
  return `Fresh ${crop.name} from a Korean rooftop urban farm in Seoul, clean modern photography, soft natural light, minimal composition, square 1:1`;
}

export async function generateTellContent(
  cropId: Crop["id"],
  day: number,
  options?: { useLiveImage?: boolean }
): Promise<TellContent> {
  const crop = CROPS.find((c) => c.id === cropId);
  if (!crop) throw new Error(`crop ${cropId} not found`);
  const ds = generateDayState(day);
  const q = QUARTERS.find((x) => x.id === ds.quarter);

  const userMessage = `오늘은 ${ds.date} (${q?.monthRange ?? ""}, ${q?.id ?? ""}).
대상 작물: ${crop.name} (${cropId}). 생육 ${ds.cropProgress}%.
센서 요약: 온도 ${ds.weather.temp}°C, 습도 ${ds.weather.humidity}%, ${ds.weather.description}.

위 응답 스키마 JSON으로 인스타 캡션 + 블로그 글 생성.`;

  const systemBlocks: SystemBlock[] = [
    { type: "text", text: buildDaoniPersonaSystem(), cache_control: { type: "ephemeral" } },
    { type: "text", text: GUIDELINES, cache_control: { type: "ephemeral" } },
  ];

  const res = await callClaude(systemBlocks, userMessage, 700);
  const block = res.content?.[0];
  const text = block && block.type === "text" ? block.text : "";
  if (!text) throw new Error("Claude 빈 응답");

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFence(text));
  } catch {
    throw new Error(`JSON 파싱 실패: ${text.slice(0, 200)}`);
  }

  const r = parsed as { instagramCaption?: string; blogPost?: string };
  if (!r?.instagramCaption || !r?.blogPost) {
    throw new Error("응답 스키마 미충족");
  }

  let thumbnailUrl: string;
  let imageMode: "seed" | "live";
  if (options?.useLiveImage) {
    const img = await generateImage(buildImagePrompt(crop), {
      size: "1024x1024",
      quality: "medium",
    });
    const item = img.data?.[0];
    const b64 = item?.b64_json;
    if (!b64) throw new Error("gpt-image-2 빈 응답");
    thumbnailUrl = `data:image/png;base64,${b64}`;
    imageMode = "live";
  } else {
    thumbnailUrl = `/seed-images/${cropId}.png`;
    imageMode = "seed";
  }

  return {
    instagramCaption: r.instagramCaption,
    blogPost: r.blogPost,
    thumbnailUrl,
    imageMode,
  };
}
