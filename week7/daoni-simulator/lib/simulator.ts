// 작물 생육 시뮬레이션 코어 (메모리 기반)
// 실 tick 로직 + DB/localStorage 연결은 Day 2+

export type Speed = 1 | 2 | 4;

export class TimeEngine {
  private currentDay = 1;
  private running = false;
  private speed: Speed = 1;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  start(): void {
    if (this.running) return;
    this.running = true;
    // Day 2+ tick 로직 (setInterval로 currentDay++ + 이벤트 큐 진행)
  }

  pause(): void {
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setSpeed(s: Speed): void {
    this.speed = s;
  }

  getCurrentDay(): number {
    return this.currentDay;
  }

  getSpeed(): Speed {
    return this.speed;
  }

  isRunning(): boolean {
    return this.running;
  }
}
