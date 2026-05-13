// Day 2에 채움 — 시장 가격·수요 mock
import type { Crop } from "./crops";

export type MarketDataPoint = {
  date: string; // YYYY-MM-DD
  cropId: Crop["id"];
  price: number; // 원/kg
  demandIndex: number; // 0..100
};

export const MARKET_MOCK: MarketDataPoint[] = [];
