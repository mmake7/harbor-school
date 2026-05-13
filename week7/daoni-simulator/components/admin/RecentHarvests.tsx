"use client";

import * as React from "react";
import { getHarvests, type Harvest } from "@/lib/harvest";
import { CROPS } from "@/data/crops";

export function RecentHarvests() {
  const [items, setItems] = React.useState<Harvest[]>([]);

  React.useEffect(() => {
    const refresh = () => setItems(getHarvests().slice(-5).reverse());
    refresh();
    const id = window.setInterval(refresh, 2000);
    return () => clearInterval(id);
  }, []);

  if (items.length === 0) {
    return (
      <div>
        <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
          최근 수확
        </h2>
        <div className="bg-base border-[0.5px] border-border rounded-lg p-6 text-center text-sm text-muted">
          아직 기록 없음. 수확 처리하면 여기 쌓여요.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
        최근 수확
      </h2>
      <div className="space-y-2">
        {items.map((h) => {
          const crop = CROPS.find((c) => c.id === h.cropId);
          return (
            <div
              key={h.harvestId}
              className="bg-base border-[0.5px] border-border rounded-md p-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="block w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: crop?.color }}
                />
                <div className="min-w-0">
                  <div className="text-sm text-ink truncate">{h.itemName}</div>
                  <div className="text-xs text-muted-light font-mono truncate">
                    {h.harvestId}
                  </div>
                </div>
              </div>
              <div className="text-sm font-mono text-ink shrink-0">
                {h.quantity}
                {h.unit === "pack" ? "팩" : "kg"} · Day {h.day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
