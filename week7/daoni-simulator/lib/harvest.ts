// 수확 기록 — localStorage 기반 (단순 유틸)
import type { Crop } from "@/data/crops";

export type Harvest = {
  harvestId: string;
  cropId: Crop["id"];
  itemId: string;             // 작물 또는 꿀 id
  itemName: string;
  day: number;
  quantity: number;
  unit: "pack" | "kg";
  registeredAt: string;       // ISO
  autoListed: boolean;        // Day 단계 5에서 활용
};

const KEY = "daoni-harvests";

export function makeHarvestId(): string {
  if (typeof window !== "undefined" && typeof crypto !== "undefined" && crypto.randomUUID) {
    return `harvest-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `harvest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getHarvests(): Harvest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Harvest[]) : [];
  } catch {
    return [];
  }
}

export function saveHarvest(h: Harvest): void {
  if (typeof window === "undefined") return;
  try {
    const all = getHarvests();
    all.push(h);
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function getHarvest(id: string): Harvest | null {
  return getHarvests().find((h) => h.harvestId === id) ?? null;
}
