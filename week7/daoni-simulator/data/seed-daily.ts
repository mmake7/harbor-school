// 일별 시뮬레이션 상태 — deterministic (Math.random 금지)
// 같은 day 입력 시 같은 출력. 변동은 Math.sin/cos + day modular.
import { QUARTERS, type Quarter } from "./seed-quarters";

export type DayWeather = {
  temp: number;
  humidity: number;
  weather_code: number;
  description: string;
};

export type DaySensors = {
  co2: number;
  light_lux: number;
  soil_moisture: number;
  beehive_activity: number;
};

export type DayEvent = {
  type: string;
  text: string;
  module: "decide" | "watch" | "care" | "tell" | "sell";
};

export type DayState = {
  day: number;
  quarter: Quarter["id"];
  date: string;
  weather: DayWeather;
  sensors: DaySensors;
  cropProgress: number;
  events: DayEvent[];
};

// day -> 분기 찾기
function findQuarter(day: number): Quarter {
  const q = QUARTERS.find((x) => day >= x.dayRange[0] && day <= x.dayRange[1]);
  if (!q) throw new Error(`day ${day} 는 분기 범위 밖`);
  return q;
}

// day -> "YYYY-MM-DD" (2026-01-01 기준 day-1 더한 ISO)
function dayToDate(day: number): string {
  const base = Date.UTC(2026, 0, 1); // 2026-01-01
  const ms = base + (day - 1) * 24 * 60 * 60 * 1000;
  return new Date(ms).toISOString().slice(0, 10);
}

// [0..1] 진동: day 기반 sin
function osc(day: number, k: number, phase = 0): number {
  return (Math.sin((day * k + phase) * Math.PI * 2) + 1) / 2;
}

// 시즌별 weather 범위 (Q1~Q4)
const WEATHER_RANGES: Record<Quarter["id"], { temp: [number, number]; humidity: [number, number]; codes: number[]; descs: string[] }> = {
  Q1: { temp: [-2, 12], humidity: [50, 70], codes: [0, 2, 71, 73], descs: ["맑음", "조금 흐림", "눈 약간", "눈"] },
  Q2: { temp: [12, 25], humidity: [60, 75], codes: [0, 1, 51, 61], descs: ["맑음", "대체로 맑음", "가벼운 이슬비", "약한 비"] },
  Q3: { temp: [24, 32], humidity: [70, 85], codes: [0, 2, 80, 95], descs: ["맑음", "조금 흐림", "소나기", "뇌우"] },
  Q4: { temp: [5, 18], humidity: [55, 70], codes: [0, 1, 3, 45], descs: ["맑음", "대체로 맑음", "흐림", "안개"] },
};

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * t;
}

function buildWeather(day: number, q: Quarter): DayWeather {
  const range = WEATHER_RANGES[q.id];
  const tempT = osc(day, 1 / 7, 0);          // 주간 사이클
  const humT  = osc(day, 1 / 5, 0.3);        // 5일 사이클
  const codeIdx = day % range.codes.length;
  return {
    temp: Math.round(lerp(range.temp[0], range.temp[1], tempT) * 10) / 10,
    humidity: Math.round(lerp(range.humidity[0], range.humidity[1], humT)),
    weather_code: range.codes[codeIdx],
    description: range.descs[codeIdx],
  };
}

function buildSensors(day: number, q: Quarter): DaySensors {
  // 개화 시기 ≈ 분기 중반 ±20일: progress 30~70% 구간에서 벌 활동 ↑
  const start = q.dayRange[0];
  const end = q.dayRange[1];
  const progress = (day - start) / (end - start); // 0..1
  const inBloom = progress > 0.3 && progress < 0.7;
  const beeBase = inBloom ? 70 : 20;
  return {
    co2: Math.round(lerp(600, 1200, osc(day, 1 / 11, 0))),
    light_lux: Math.round(lerp(15000, 25000, osc(day, 1 / 13, 0.5))),
    soil_moisture: Math.round(lerp(60, 80, osc(day, 1 / 9, 0.7))),
    beehive_activity: Math.round(lerp(beeBase - 15, beeBase + 15, osc(day, 1 / 4, 0.2))),
  };
}

function buildCropProgress(day: number, q: Quarter): number {
  const start = q.dayRange[0];
  const end = q.dayRange[1];
  const t = (day - start) / (end - start); // 0..1 선형
  return Math.round(Math.max(0, Math.min(1, t)) * 100);
}

export function generateDayState(day: number): DayState {
  if (!Number.isInteger(day) || day < 1 || day > 365) {
    throw new Error(`day must be integer in [1, 365], got ${day}`);
  }
  const q = findQuarter(day);
  return {
    day,
    quarter: q.id,
    date: dayToDate(day),
    weather: buildWeather(day, q),
    sensors: buildSensors(day, q),
    cropProgress: buildCropProgress(day, q),
    events: [], // simulator.ts tick에서 동적 추가
  };
}
