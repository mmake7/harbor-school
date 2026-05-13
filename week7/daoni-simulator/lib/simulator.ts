// 작물 생육 시뮬레이션 코어 — Day 2 단계 3 풀 구현
// 365일 시뮬레이션. speed별 setInterval. localStorage 영속성. Pub/sub.
// 1 tick = 6시간 (currentDay += 0.25).
import { QUARTERS, type Quarter } from "@/data/seed-quarters";
import { generateDayState, type DayState } from "@/data/seed-daily";

export type Speed = 1 | 2 | 4;

export type TimeEngineState = {
  currentDay: number;
  quarter: Quarter["id"];
  isRunning: boolean;
  speed: Speed;
  dayState: DayState;
};

const STORAGE_KEY = "daoni-time-engine";
type Subscriber = (state: TimeEngineState) => void;

export class TimeEngine {
  private currentDay: number = 1;       // 1.0 누적 (1tick = 1일)
  private speed: Speed = 1;
  private running = false;
  private tickInterval: ReturnType<typeof setInterval> | null = null;
  private subscribers: Set<Subscriber> = new Set();

  constructor(initialDay?: number) {
    let restored: { currentDay?: number; speed?: Speed } | null = null;
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) restored = JSON.parse(raw);
      } catch {
        // localStorage 접근 실패 — silently 무시
      }
    }
    this.currentDay = restored?.currentDay ?? initialDay ?? 1;
    this.speed = restored?.speed ?? 1;
    // running 자동 resume X (형 결정으로 시작 명시)
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.tickInterval = setInterval(() => this.tick(), this.intervalForSpeed());
    this.notify();
  }

  pause(): void {
    if (!this.running) return;
    this.running = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
    this.persist();
    this.notify();
  }

  setSpeed(speed: Speed): void {
    this.speed = speed;
    if (this.running) {
      if (this.tickInterval) clearInterval(this.tickInterval);
      this.tickInterval = setInterval(() => this.tick(), this.intervalForSpeed());
    }
    this.persist();
    this.notify();
  }

  jumpToDay(day: number): void {
    if (!Number.isFinite(day)) return;
    const clamped = Math.max(1, Math.min(365, Math.floor(day)));
    this.currentDay = clamped;
    this.persist();
    this.notify();
  }

  reset(): void {
    this.pause();
    this.currentDay = 1;
    this.speed = 1;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  getCurrentDay(): number {
    return Math.floor(this.currentDay);
  }

  getCurrentQuarter(): Quarter {
    const day = this.getCurrentDay();
    const q = QUARTERS.find((x) => day >= x.dayRange[0] && day <= x.dayRange[1]);
    if (!q) throw new Error(`day ${day} 분기 범위 밖`);
    return q;
  }

  getCurrentDayState(): DayState {
    return generateDayState(this.getCurrentDay());
  }

  getSpeed(): Speed {
    return this.speed;
  }

  isRunning(): boolean {
    return this.running;
  }

  subscribe(fn: Subscriber): () => void {
    this.subscribers.add(fn);
    return () => {
      this.subscribers.delete(fn);
    };
  }

  // ---- private ----

  private tick(): void {
    let next = this.currentDay + 1.0;
    if (next > 365) next = 1; // wrap (시연 끊김 X)
    this.currentDay = next;
    this.persist();
    this.notify();
  }

  private intervalForSpeed(): number {
    return this.speed === 4 ? 1000 : this.speed === 2 ? 2000 : 4000;
  }

  private persist(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentDay: this.currentDay, speed: this.speed })
      );
    } catch {
      // quota exceeded 등 — silently 무시
    }
  }

  private snapshot(): TimeEngineState {
    return {
      currentDay: this.getCurrentDay(),
      quarter: this.getCurrentQuarter().id,
      isRunning: this.running,
      speed: this.speed,
      dayState: this.getCurrentDayState(),
    };
  }

  private notify(): void {
    const state = this.snapshot();
    this.subscribers.forEach((fn) => fn(state));
  }
}
