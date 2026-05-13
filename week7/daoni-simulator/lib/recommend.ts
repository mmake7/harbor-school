// "오늘의 다온이 식탁" 추천 코어
// 패턴: harbor-community/api/moon.js:372,396 (Promise.all로 데이터 동시 수집 → callClaude)
// 실 데이터 소스 연결은 Day 2+

import { callClaude, buildDaoniPersonaSystem } from "./claude";
import type { Recipe } from "@/data/recipes";
import type { Crop } from "@/data/crops";

type FarmInventoryState = { ready: Crop["id"][]; lowStock: Crop["id"][] };
type WeatherState = { temp: number; condition: string };
type SeasonalContext = { quarter: 1 | 2 | 3 | 4; monthRange: string };

export type TodayRecommendation = {
  todayPick: Crop["id"];
  recipe: Recipe;
  pairings: string[];
};

async function getFarmInventory(): Promise<FarmInventoryState> {
  // Day 2+ — 실 농장 상태 (DB 또는 시뮬레이터)
  return { ready: [], lowStock: [] };
}

async function getWeather(): Promise<WeatherState> {
  // Day 2+ — moon.js의 Open-Meteo 패턴 그대로 (서울 종로구 좌표 → 염창동 좌표로 교체)
  return { temp: 0, condition: "" };
}

async function getSeasonalContext(): Promise<SeasonalContext> {
  // Day 2+ — 현재 날짜 또는 시뮬레이터 currentDay에서 분기 계산
  return { quarter: 1, monthRange: "1~3월" };
}

export async function getTodayRecommendation(): Promise<TodayRecommendation> {
  const [_inv, _wx, _ctx] = await Promise.all([
    getFarmInventory(),
    getWeather(),
    getSeasonalContext(),
  ]);

  // Day 2+:
  //   const sys = [{ type: "text", text: buildDaoniPersonaSystem(), cache_control: { type: "ephemeral" } }];
  //   const res = await callClaude(sys, `오늘의 식탁 추천. 농장:${...} 날씨:${...} 시즌:${...}`);
  //   응답에서 todayPick / recipe / pairings 파싱
  void buildDaoniPersonaSystem;
  void callClaude;

  throw new Error("Day 2+에 구현");
}
