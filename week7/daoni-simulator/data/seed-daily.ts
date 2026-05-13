// Day 2에 채움 — 일별 시뮬레이션 데이터 생성
import type { Crop } from "./crops";

export type DailyState = {
  day: number; // 1..365
  cropId: Crop["id"];
  growthPct: number; // 0..100
  health: number; // 0..100
  events: string[];
};

export function generateDaily(_day: number, _cropId: Crop["id"]): DailyState {
  throw new Error("Day 2에 구현");
}
