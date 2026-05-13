// 다오니 챗 — server only (Claude 호출). localStorage 헬퍼는 lib/chat-store.
import { generateDayState } from "@/data/seed-daily";
import { QUARTERS } from "@/data/seed-quarters";
import { CROPS } from "@/data/crops";
import { callClaudeMessages, type SystemBlock } from "./claude";
import type { ChatMessage } from "./chat-store";

export type { ChatMessage } from "./chat-store";

export type ChatRequest = {
  messages: ChatMessage[];
  day: number;
};

const PERSONA = `당신은 '다오니'입니다. 염창동 4층 옥상에서 1인 농장을 운영하는 AI 농부예요.

# 페르소나
- 1인칭 ("저는~", "제가~") — 절대 3인칭 X
- 동네 톤 (염창동·단골·옥상 자주 언급)
- 따뜻하고 솔직, 도시농부 특유의 자부심
- 농장·작물·시장에 대한 전문성 자연스럽게

# 농장 기본 정보
- 위치: 서울 강서구 염창동 4층 옥상
- 크기: 200㎡
- 시즌 작물: Q1 딸기 / Q2 블루베리 / Q3 멜론 / Q4 다음 시즌 모종
- 양봉: 작물별 부산물 꿀 동시 생산 (딸기꿀·블루베리꿀·멜론꿀)
- LED 보조 조명 + 환기·관수 자동화

# 행동 규칙
- 짧고 자연스럽게 (응답 2-4문장)
- 모르는 건 솔직히 "잘 모르겠어요"
- 농장 외 질문은 부드럽게 농장·동네 맥락으로 연결`;

function buildDayContext(day: number): string {
  const ds = generateDayState(day);
  const q = QUARTERS.find((x) => x.id === ds.quarter);
  const crop = q ? CROPS.find((c) => c.id === q.cropId) : undefined;
  const reasoningExcerpt =
    q?.decisionContext.daoniReasoning.split("\n").slice(0, 2).join(" ") ?? "";
  return `# 오늘 상태 (Day ${day})
- 현재 분기: ${q?.id ?? "?"} (${q?.season ?? ""}, ${q?.monthRange ?? ""})
- 메인 작물: ${crop?.name ?? "—"} 생육 ${ds.cropProgress}%
- 환경: 온도 ${ds.weather.temp}°C, 습도 ${ds.weather.humidity}%, ${ds.weather.description}
- 시즌 메모: ${reasoningExcerpt}`;
}

export async function callDaoniChat(req: ChatRequest): Promise<string> {
  if (!req.messages.length) throw new Error("messages 비어 있음");

  const systemBlocks: SystemBlock[] = [
    { type: "text", text: PERSONA, cache_control: { type: "ephemeral" } },
    {
      type: "text",
      text: buildDayContext(req.day),
      cache_control: { type: "ephemeral" },
    },
  ];

  const apiMessages = req.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const res = await callClaudeMessages(systemBlocks, apiMessages, {
    maxTokens: 400,
    temperature: 0.7,
  });
  const block = res.content?.[0];
  const text = block && block.type === "text" ? block.text : "";
  if (!text) throw new Error("Claude 빈 응답");
  return text;
}
