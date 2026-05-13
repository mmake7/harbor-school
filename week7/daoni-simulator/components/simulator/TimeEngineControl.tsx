"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { QUARTERS } from "@/data/seed-quarters";

const PRESETS: { label: string; day: number }[] = [
  { label: "Q1 재배 중", day: 30 },
  { label: "Q1 수확", day: 88 },
  { label: "Q2 시작", day: 91 },
  { label: "Q2 수확", day: 178 },
];

export function TimeEngineControl({ currentDay }: { currentDay: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const q = QUARTERS.find(
    (x) => currentDay >= x.dayRange[0] && currentDay <= x.dayRange[1]
  );

  function jumpTo(day: number) {
    const params = new URLSearchParams(sp?.toString() ?? "");
    params.set("day", String(day));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="bg-base border-[0.5px] border-border rounded-lg p-3 flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 mr-2">
        <span className="text-xs text-muted">현재</span>
        <span className="font-mono text-sm text-ink">Day {currentDay} / 365</span>
        {q && (
          <span className="text-xs text-muted">
            · {q.id} {q.monthRange}
          </span>
        )}
      </div>
      <div className="text-xs text-muted">시연 점프</div>
      {PRESETS.map((p) => {
        const active = p.day === currentDay;
        return (
          <button
            key={p.day}
            onClick={() => jumpTo(p.day)}
            className={`text-xs rounded-md px-3 py-1.5 border-[0.5px] ${
              active
                ? "bg-ink text-white border-ink"
                : "bg-base text-ink border-border hover:border-border-strong"
            }`}
          >
            {p.label}{" "}
            <span className="opacity-60 ml-1 font-mono">D{p.day}</span>
          </button>
        );
      })}
    </div>
  );
}
