// 다온이 일일 브리핑 — 라이브 Claude
import { generateDayState } from "@/data/seed-daily";
import { QUARTERS } from "@/data/seed-quarters";
import { CROPS } from "@/data/crops";
import { callClaude, buildDaoniPersonaSystem, type SystemBlock } from "./claude";
import { getWeather } from "./recommend";

export type DailyBriefing = {
  greeting: string;
  farmStatus: string;
  todayPlan: string[];
  weatherNote: string;
  seasonOutlook: string;
};

const GUIDELINES = `너는 다온이 — 염창동 옥상농장 자율 운영자.
관리자(농장 사장)에게 일일 브리핑을 1인칭으로 들려준다.

[응답 규칙]
- 반드시 순수 JSON. 마크다운 코드블록(\`\`\`) 금지.
- greeting: 1인칭 인사, 40자 이내 한 문장.
- farmStatus: 농장 현재 상태 요약, 80자 이내.
- todayPlan: 오늘 할 일 2~3개 짧은 문장 배열.
- weatherNote: 날씨 한 줄.
- seasonOutlook: 시즌 전망 한 줄.

[응답 스키마]
{
  "greeting": "...",
  "farmStatus": "...",
  "todayPlan": ["...", "..."],
  "weatherNote": "...",
  "seasonOutlook": "..."
}`;

function stripJsonFence(s: string): string {
  return s
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function getDailyBriefing(currentDay: number): Promise<DailyBriefing> {
  const ds = generateDayState(currentDay);
  const q = QUARTERS.find((x) => x.id === ds.quarter);
  if (!q) throw new Error(`quarter for day ${currentDay} not found`);
  const crop = CROPS.find((c) => c.id === q.cropId);
  if (!crop) throw new Error(`crop ${q.cropId} not found`);
  const wx = await getWeather();

  const userMessage = `오늘은 ${ds.date} (${q.monthRange}, ${q.id}).
현재 시즌 작물: ${crop.name} (생육 ${ds.cropProgress}%).
센서: 온도 ${ds.weather.temp}°C, 습도 ${ds.weather.humidity}%.
염창동 외부 날씨: ${wx.temp}°C, ${wx.description}.

위 응답 스키마 JSON으로 일일 브리핑.`;

  const systemBlocks: SystemBlock[] = [
    { type: "text", text: buildDaoniPersonaSystem(), cache_control: { type: "ephemeral" } },
    { type: "text", text: GUIDELINES, cache_control: { type: "ephemeral" } },
  ];

  const res = await callClaude(systemBlocks, userMessage, 500);
  const block = res.content?.[0];
  const text = block && block.type === "text" ? block.text : "";
  if (!text) throw new Error("Claude 빈 응답");

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFence(text));
  } catch {
    throw new Error(`JSON 파싱 실패: ${text.slice(0, 200)}`);
  }

  const r = parsed as DailyBriefing;
  if (!r?.greeting || !r?.farmStatus || !Array.isArray(r?.todayPlan)) {
    throw new Error("응답 스키마 미충족");
  }
  r.todayPlan = r.todayPlan.slice(0, 5);
  if (typeof r.weatherNote !== "string") r.weatherNote = "";
  if (typeof r.seasonOutlook !== "string") r.seasonOutlook = "";
  return r;
}
