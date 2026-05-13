// "오늘의 다온이 식탁" 라이브 추천 — Promise.all + Open-Meteo + Claude
// 패턴: harbor-community/api/moon.js (Promise.all + ephemeral cache)
//      + dongne-golmok/api/ai.js (system blocks 캐시)
import { CROPS, type Crop } from "@/data/crops";
import { QUARTERS } from "@/data/seed-quarters";
import { generateDayState } from "@/data/seed-daily";
import { RECIPES } from "@/data/recipes";
import { callClaude, buildDaoniPersonaSystem, type SystemBlock } from "./claude";

export type TodayRecommendation = {
  todayPick: { cropId: Crop["id"]; reasoning: string };
  recipe: { recipeId: string; twist: string };
  pairings: Array<{ type: "honey" | "crop"; id: string; reason: string }>;
};

type FarmInventory = {
  currentCropId: Crop["id"];
  cropProgress: number;
  ready: Crop["id"][];
  honey: { id: string; name: string } | null;
};

type WeatherSnapshot = {
  temp: number;
  humidity: number;
  description: string;
};

type SeasonalContext = {
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  monthRange: string;
  hour: number;
  date: string;
};

async function getFarmInventory(day: number): Promise<FarmInventory> {
  const ds = generateDayState(day);
  const q = QUARTERS.find((x) => x.id === ds.quarter);
  if (!q) throw new Error(`quarter for day ${day} not found`);
  const crop = CROPS.find((c) => c.id === q.cropId);
  if (!crop) throw new Error(`crop ${q.cropId} not found`);
  return {
    currentCropId: crop.id,
    cropProgress: ds.cropProgress,
    ready: ds.cropProgress >= 80 ? [crop.id] : [],
    honey: crop.honey,
  };
}

const WEATHER_CODE_KO: Record<number, string> = {
  0: "맑음", 1: "대체로 맑음", 2: "조금 흐림", 3: "흐림",
  45: "안개", 48: "짙은 안개",
  51: "약한 이슬비", 53: "이슬비", 55: "강한 이슬비",
  61: "약한 비", 63: "비", 65: "강한 비",
  71: "약한 눈", 73: "눈", 75: "강한 눈",
  80: "소나기", 81: "강한 소나기", 82: "매우 강한 소나기",
  95: "뇌우", 96: "뇌우 우박", 99: "강한 뇌우 우박",
};

async function getWeather(): Promise<WeatherSnapshot> {
  // 염창동 좌표 (37.55, 126.86), Open-Meteo 키 X
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=37.55&longitude=126.86&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FSeoul";
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = await res.json();
  const c = data?.current ?? {};
  const code = typeof c.weather_code === "number" ? c.weather_code : -1;
  return {
    temp: typeof c.temperature_2m === "number" ? c.temperature_2m : 0,
    humidity: typeof c.relative_humidity_2m === "number" ? c.relative_humidity_2m : 0,
    description: WEATHER_CODE_KO[code] ?? "알 수 없음",
  };
}

async function getSeasonalContext(day: number): Promise<SeasonalContext> {
  const ds = generateDayState(day);
  const q = QUARTERS.find((x) => x.id === ds.quarter);
  if (!q) throw new Error(`quarter for day ${day} not found`);
  // KST = UTC+9
  const kstHour = (new Date().getUTCHours() + 9) % 24;
  return {
    quarter: q.id,
    monthRange: q.monthRange,
    hour: kstHour,
    date: ds.date,
  };
}

const CROP_INDEX = CROPS.map((c) => `${c.id}(${c.name})`).join(", ");
const RECIPE_INDEX = RECIPES.map((r) => `${r.id}(${r.name}/${r.crop})`).join(", ");
const HONEY_IDS = CROPS.filter((c) => c.honey).map((c) => c.honey!.id).join(", ");

const GUIDELINES = `너는 다온이 — 염창동 옥상농장 자율 운영자.
오늘 손님께 추천할 "오늘의 식탁"을 결정해야 한다.

[가용 작물 ID(이름)]: ${CROP_INDEX}
[가용 레시피 ID(이름/작물)]: ${RECIPE_INDEX}
[가용 꿀 ID]: ${HONEY_IDS}

[응답 규칙]
- 반드시 순수 JSON. 마크다운 코드블록(\`\`\`) 금지.
- todayPick.cropId는 가용 작물 ID 중 하나.
- recipe.recipeId는 가용 레시피 ID 중 하나. 가능하면 todayPick.cropId의 레시피 우선.
- pairings 1~2개. type은 "honey" 또는 "crop", id는 가용 ID.
- reasoning 1인칭 50자 이내.
- twist 30자 이내 한 문장.
- pairings reason도 짧게 한 줄.

[응답 스키마]
{
  "todayPick": { "cropId": "...", "reasoning": "..." },
  "recipe": { "recipeId": "...", "twist": "..." },
  "pairings": [{ "type": "honey"|"crop", "id": "...", "reason": "..." }]
}`;

function stripJsonFence(s: string): string {
  return s
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function getTodayRecommendation(currentDay: number): Promise<TodayRecommendation> {
  const [inv, wx, ctx] = await Promise.all([
    getFarmInventory(currentDay),
    getWeather(),
    getSeasonalContext(currentDay),
  ]);

  const userMessage = `오늘은 ${ctx.date} (${ctx.monthRange}, ${ctx.quarter}), KST ${ctx.hour}시.
농장 재고: 현재 분기 작물=${inv.currentCropId}, 생육 ${inv.cropProgress}%, 수확가능=${inv.ready.length > 0 ? "예" : "아니오"}, 부산물 꿀=${inv.honey?.id ?? "없음"}.
염창동 날씨: ${wx.temp}°C, 습도 ${wx.humidity}%, ${wx.description}.

위 응답 스키마 JSON으로 오늘의 식탁 추천해.`;

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
    throw new Error(`Claude JSON 파싱 실패: ${text.slice(0, 200)}`);
  }

  const r = parsed as TodayRecommendation;
  if (!r?.todayPick?.cropId || !r?.recipe?.recipeId) {
    throw new Error("Claude 응답 스키마 미충족");
  }
  if (!Array.isArray(r.pairings)) r.pairings = [];
  return r;
}
