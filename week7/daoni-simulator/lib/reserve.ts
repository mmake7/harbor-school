import type { Crop } from "@/data/crops";

export type Reservation = {
  reservationId: string;
  cropId: Crop["id"];
  reservedAt: string;
  quantity: number;
  status: "pending" | "fulfilled";
};

const KEY = "daoni-reservations";

export function getReservations(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Reservation[]) : [];
  } catch {
    return [];
  }
}

export function saveReservation(reservation: Reservation): void {
  if (typeof window === "undefined") return;
  try {
    const all = getReservations();
    all.push(reservation);
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function hasReserved(cropId: Crop["id"]): boolean {
  return getReservations().some((r) => r.cropId === cropId);
}

export function makeReservationId(): string {
  return `RV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const MESSAGES: Partial<Record<Crop["id"], string>> = {
  strawberry: "딸기 예약 접수됐어요. 다음 시즌(1월) 도래하면 알려드릴게요!",
  blueberry: "블루베리 예약 접수됐어요. 5월에 만나요!",
  melon: "멜론 예약 접수됐어요. 7월에 만나요!",
};

export function getDaoniReservationMessage(cropId: Crop["id"]): string {
  return MESSAGES[cropId] ?? "예약 접수됐어요. 시즌 도래하면 알려드릴게요!";
}
