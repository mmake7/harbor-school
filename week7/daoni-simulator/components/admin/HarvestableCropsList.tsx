"use client";

import * as React from "react";
import { generateDayState } from "@/data/seed-daily";
import { CROPS } from "@/data/crops";
import { QUARTERS } from "@/data/seed-quarters";
import { saveHarvest, makeHarvestId } from "@/lib/harvest";

type Status = "growing" | "soon" | "ready";

export function HarvestableCropsList({ day }: { day: number }) {
  const [harvested, setHarvested] = React.useState<Set<string>>(new Set());
  const [daoni, setDaoni] = React.useState<string | null>(null);

  const ds = generateDayState(day);
  const q = QUARTERS.find((x) => x.id === ds.quarter);
  const crop = q ? CROPS.find((c) => c.id === q.cropId) : undefined;

  const status: Status =
    ds.cropProgress >= 95 ? "ready" : ds.cropProgress >= 80 ? "soon" : "growing";

  const cropQty = Math.round(60 * (ds.cropProgress / 100));
  const honeyQty = crop?.honey ? Math.round(8 * (ds.cropProgress / 100)) : 0;

  function handleHarvest(target: { itemId: string; itemName: string; quantity: number; unit: "pack" | "kg" }) {
    if (!crop) return;
    saveHarvest({
      harvestId: makeHarvestId(),
      cropId: crop.id,
      itemId: target.itemId,
      itemName: target.itemName,
      day,
      quantity: target.quantity,
      unit: target.unit,
      registeredAt: new Date().toISOString(),
      autoListed: false,
    });
    setHarvested((prev) => {
      const next = new Set(prev);
      next.add(target.itemId);
      return next;
    });
    setDaoni(
      `${target.itemName} ${target.quantity}${target.unit === "pack" ? "팩" : "kg"} 수확했어요. 곧 쇼핑몰에 등록할게요.`
    );
    window.setTimeout(() => setDaoni(null), 4000);
  }

  if (!crop) {
    return (
      <div className="bg-base border-[0.5px] border-border rounded-lg p-6 text-center text-sm text-muted">
        분기 정보를 찾을 수 없어요.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <HarvestCard
        cropColor={crop.color}
        title={crop.name}
        progress={ds.cropProgress}
        quantity={cropQty}
        unit="pack"
        status={status}
        harvested={harvested.has(crop.id)}
        onHarvest={() =>
          handleHarvest({
            itemId: crop.id,
            itemName: crop.name,
            quantity: cropQty,
            unit: "pack",
          })
        }
      />

      {crop.honey && (
        <HarvestCard
          cropColor="#FBBF24"
          title={crop.honey.name}
          progress={ds.cropProgress}
          quantity={honeyQty}
          unit="kg"
          status={status}
          harvested={harvested.has(crop.honey.id)}
          onHarvest={() =>
            handleHarvest({
              itemId: crop.honey!.id,
              itemName: crop.honey!.name,
              quantity: honeyQty,
              unit: "kg",
            })
          }
        />
      )}

      {daoni && (
        <div className="bg-ink text-white rounded-lg p-4 flex gap-3">
          <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
          <div className="text-sm text-white/90">{daoni}</div>
        </div>
      )}
    </div>
  );
}

function HarvestCard(props: {
  cropColor: string;
  title: string;
  progress: number;
  quantity: number;
  unit: "pack" | "kg";
  status: Status;
  harvested: boolean;
  onHarvest: () => void;
}) {
  const badge = props.harvested
    ? "수확 완료"
    : props.status === "ready"
    ? "수확 가능"
    : props.status === "soon"
    ? "수확 임박"
    : "재배 중";
  const badgeClass = props.harvested
    ? "bg-muted-light text-white"
    : props.status === "ready"
    ? "bg-primary text-white"
    : props.status === "soon"
    ? "bg-primary-light text-primary-dark"
    : "bg-surface text-muted";

  return (
    <div className="bg-base border-[0.5px] border-border rounded-lg p-4 flex items-center gap-4">
      <span
        className="block w-2 h-2 rounded-full shrink-0"
        style={{ background: props.cropColor }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="text-ink font-medium">{props.title}</div>
          <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${badgeClass}`}>
            {badge}
          </span>
        </div>
        <div className="text-xs text-muted font-mono mt-1">
          진척 {props.progress}% · 예상 {props.quantity}
          {props.unit === "pack" ? "팩" : "kg"}
        </div>
        <div className="h-1 bg-surface rounded mt-2 overflow-hidden">
          <div
            className="h-1 rounded"
            style={{ background: props.cropColor, width: `${props.progress}%` }}
          />
        </div>
      </div>
      <button
        onClick={props.onHarvest}
        disabled={props.status !== "ready" || props.harvested}
        className="bg-primary text-white text-sm font-medium rounded-md px-4 py-1.5 hover:bg-primary-dark disabled:opacity-40 shrink-0"
      >
        수확 처리
      </button>
    </div>
  );
}
