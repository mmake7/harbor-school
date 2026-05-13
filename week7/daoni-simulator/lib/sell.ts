// Sell 모듈 — 수확 → 자동 쇼핑몰 등록 (localStorage)
import { CROPS, type Crop } from "@/data/crops";
import type { Harvest } from "./harvest";

export type Listing = {
  listingId: string;
  cropId: Crop["id"];
  itemId: string;
  itemName: string;
  harvestId: string;
  price: number;
  quantity: number;
  unit: "pack" | "kg";
  listedAt: string;     // ISO
  daoniNote: string;
};

const KEY = "daoni-listings";

export function makeListingId(): string {
  if (typeof window !== "undefined" && typeof crypto !== "undefined" && crypto.randomUUID) {
    return `listing-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `listing-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getListings(): Listing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Listing[]) : [];
  } catch {
    return [];
  }
}

export function getListing(id: string): Listing | null {
  return getListings().find((l) => l.listingId === id) ?? null;
}

export function listProductFromHarvest(harvest: Harvest): Listing {
  const crop = CROPS.find((c) => c.id === harvest.cropId);
  const isHoney = harvest.unit === "kg";
  const price = isHoney
    ? crop?.honey?.price ?? 0
    : crop?.defaultPrice ?? 0;
  const daoniNote = isHoney
    ? `${harvest.quantity}kg 꿀, 한정 수량으로 등록. 평소 단골님부터 연락드릴게요.`
    : `${harvest.quantity}팩 신선 등록. 단골 카페에 알림 보냈어요.`;

  const listing: Listing = {
    listingId: makeListingId(),
    cropId: harvest.cropId,
    itemId: harvest.itemId,
    itemName: harvest.itemName,
    harvestId: harvest.harvestId,
    price,
    quantity: harvest.quantity,
    unit: harvest.unit,
    listedAt: new Date().toISOString(),
    daoniNote,
  };

  if (typeof window !== "undefined") {
    try {
      const all = getListings();
      all.push(listing);
      window.localStorage.setItem(KEY, JSON.stringify(all));
    } catch {
      // ignore
    }
  }

  return listing;
}
