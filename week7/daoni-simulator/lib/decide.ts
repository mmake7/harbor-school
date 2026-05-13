// 다온이 시즌 결정 — 라이브 Claude
import { generateDayState } from "@/data/seed-daily";
import { QUARTERS } from "@/data/seed-quarters";
import { CROPS, type Crop } from "@/data/crops";
import { MARKET_SIGNALS_BY_QUARTER } from "@/data/mock-market";
import { callClaude, buildDaoniPersonaSystem, type SystemBlock } from "./claude";

export type DecideRecommendation = {
  recommendedCropId: Crop["id"];
  reasoning: string;
  marketAnalysis: { trend: string; priceForecast: string; risks: string[] };
  estimatedRevenue: { amount: number; basis: string };
  decisionDay: number;
};

const VALID_IDS: Crop["id"][] = ["strawberry", "blueberry", "melon", "sprout"];
const CROP_INDEX = CROPS.map(
  (c) => `${c.id}(${c.name}, defaultPrice=${c.defaultPrice})`
).join(", ");

const GUIDELINES = `너는 다온이 — 염창동 옥상농장 자율 운영자.
다가오는 분기 작물을 결정한다. 시장 시그널·날씨·시즌 근거로.

[가용 작물 ID(이름, 단가)]: ${CROP_INDEX}

[응답 규칙]
- 반드시 순수 JSON, 마크다운 fence(\`\`\`) 금지.
- recommendedCropId: 가용 작물 ID 중 하나 (입력 분기와 일치 권장).
- reasoning: 1인칭 4~5문장, 시장·날씨·동네 단골 톤.
- marketAnalysis.trend: 한 줄.
- marketAnalysis.priceForecast: 한 줄.
- marketAnalysis.risks: 1~3개 짧은 문장 배열.
- estimatedRevenue.amount: 원 단위 정수 추정 (작물 단가 × 예상 출하량).
- estimatedRevenue.basis: 추정 근거 한 줄.
- decisionDay: 입력의 quarter.decisionDay 그대로.

[응답 스키마]
{
  "recommendedCropId": "...",
  "reasoning": "...",
  "marketAnalysis": { "trend": "...", "priceForecast": "...", "risks": ["..."] },
  "estimatedRevenue": { "amount": 12000000, "basis": "..." },
  "decisionDay": 88
}`;

function stripJsonFence(s: string): string {
  return s
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function getDecideRecommendation(
  currentDay: number
): Promise<DecideRecommendation> {
  const ds = generateDayState(currentDay);
  const q = QUARTERS.find((x) => x.id === ds.quarter);
  if (!q) throw new Error(`quarter for day ${currentDay} not found`);
  const signals = MARKET_SIGNALS_BY_QUARTER[q.id] ?? [];

  const signalsSummary = signals
    .map((s) => `${s.date}: ${s.trendNote} | ${s.newsItems[0]?.headline ?? ""}`)
    .join("\n");

  const userMessage = `결정 대상 분기: ${q.id} (${q.season}, ${q.monthRange}, decisionDay=${q.decisionDay}).
시즌 시드 결정 근거(참고용):
- marketTrend: ${q.decisionContext.marketTrend}
- weatherForecast: ${q.decisionContext.weatherForecast}

시장 시그널 시계열:
${signalsSummary}

위 응답 스키마 JSON으로 분기 결정해.`;

  const systemBlocks: SystemBlock[] = [
    { type: "text", text: buildDaoniPersonaSystem(), cache_control: { type: "ephemeral" } },
    { type: "text", text: GUIDELINES, cache_control: { type: "ephemeral" } },
  ];

  const res = await callClaude(systemBlocks, userMessage, 800);
  const block = res.content?.[0];
  const text = block && block.type === "text" ? block.text : "";
  if (!text) throw new Error("Claude 빈 응답");

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFence(text));
  } catch {
    throw new Error(`JSON 파싱 실패: ${text.slice(0, 200)}`);
  }

  const r = parsed as DecideRecommendation;
  if (!VALID_IDS.includes(r?.recommendedCropId)) {
    throw new Error(`recommendedCropId 비유효: ${r?.recommendedCropId}`);
  }
  if (!r.marketAnalysis) {
    r.marketAnalysis = { trend: "", priceForecast: "", risks: [] };
  }
  if (!Array.isArray(r.marketAnalysis.risks)) r.marketAnalysis.risks = [];
  r.marketAnalysis.risks = r.marketAnalysis.risks.slice(0, 5);
  if (typeof r.estimatedRevenue?.amount !== "number") {
    r.estimatedRevenue = { amount: 0, basis: "" };
  }
  if (typeof r.decisionDay !== "number") r.decisionDay = q.decisionDay;
  return r;
}
