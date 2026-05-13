// Day 2에 채움 — 분기별 macro 데이터 (수확량 추정·시장 가격 평균·날씨 트렌드)
import type { Crop } from "./crops";

export type QuarterMacro = {
  quarter: 1 | 2 | 3 | 4;
  cropId: Crop["id"];
  estYield: number; // kg
  avgPrice: number; // 원/kg
  weatherTrend: "cold" | "mild" | "hot" | "cool";
  notes: string;
};

export const QUARTERS: QuarterMacro[] = [];
