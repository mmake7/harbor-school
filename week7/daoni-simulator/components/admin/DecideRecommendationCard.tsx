"use client";

import * as React from "react";
import { CROPS } from "@/data/crops";

type Decide = {
  recommendedCropId: string;
  reasoning: string;
  marketAnalysis: { trend: string; priceForecast: string; risks: string[] };
  estimatedRevenue: { amount: number; basis: string };
  decisionDay: number;
};

export function DecideRecommendationCard({ day }: { day: number }) {
  const [state, setState] = React.useState<"loading" | "success" | "error">("loading");
  const [data, setData] = React.useState<Decide | null>(null);
  const [err, setErr] = React.useState("");
  const [reload, setReload] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    setState("loading");
    fetch(`/api/decide?day=${day}`)
      .then(async (r) => {
        const json = await r.json();
        if (cancelled) return;
        if (!r.ok) {
          setErr(json?.error ?? `HTTP ${r.status}`);
          setState("error");
          return;
        }
        setData(json as Decide);
        setState("success");
      })
      .catch((e) => {
        if (cancelled) return;
        setErr(e instanceof Error ? e.message : String(e));
        setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [day, reload]);

  if (state === "loading") {
    return (
      <div className="bg-base border-[0.5px] border-border rounded-lg p-6 animate-pulse space-y-3">
        <div className="h-3 w-1/3 bg-surface rounded" />
        <div className="h-8 w-1/2 bg-surface rounded" />
        <div className="h-20 bg-surface rounded" />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="bg-base border-[0.5px] border-border rounded-lg p-6 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-muted mb-1">다온이 결정</div>
          <div className="text-sm text-ink">다온이가 잠시 자리를 비웠어요.</div>
          <div className="text-xs text-muted-light font-mono mt-1 truncate">
            {err.slice(0, 100)}
          </div>
        </div>
        <button
          onClick={() => setReload((v) => v + 1)}
          className="bg-primary text-white text-sm rounded-md px-3 py-1.5 hover:bg-primary-dark shrink-0"
        >
          다시 물어보기
        </button>
      </div>
    );
  }

  const r = data!;
  const crop = CROPS.find((c) => c.id === r.recommendedCropId);

  return (
    <div className="space-y-4">
      <div className="bg-base border-[0.5px] border-border rounded-lg p-6">
        <div className="text-xs text-muted mb-2">
          다온이 추천 작물 · 결정일 D{r.decisionDay}
        </div>
        <div className="flex items-center gap-3">
          <span
            className="block w-3 h-3 rounded-full"
            style={{ background: crop?.color ?? "#10B981" }}
          />
          <div className="text-3xl font-bold text-ink">
            {crop?.name ?? r.recommendedCropId}
          </div>
        </div>
      </div>

      <div className="bg-ink text-white rounded-lg p-6 flex gap-3">
        <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
        <div className="text-sm leading-relaxed text-white/90 whitespace-pre-line">
          {r.reasoning}
        </div>
      </div>

      <div className="bg-base border-[0.5px] border-border rounded-lg p-4">
        <div className="text-xs text-muted mb-3">시장 분석</div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-muted-light mb-1">트렌드</div>
            <div className="text-ink">{r.marketAnalysis.trend}</div>
          </div>
          <div>
            <div className="text-xs text-muted-light mb-1">가격 전망</div>
            <div className="text-ink">{r.marketAnalysis.priceForecast}</div>
          </div>
        </div>
        {r.marketAnalysis.risks.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-muted-light mb-1">리스크</div>
            <ul className="text-sm text-ink space-y-1">
              {r.marketAnalysis.risks.map((rk, i) => (
                <li key={i}>· {rk}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-primary-light text-primary-dark rounded-lg p-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs mb-1">예상 매출</div>
          <div className="font-mono text-2xl font-bold">
            ₩{r.estimatedRevenue.amount.toLocaleString()}
          </div>
        </div>
        <div className="text-xs text-primary-dark/80 max-w-xs text-right">
          {r.estimatedRevenue.basis}
        </div>
      </div>

      <button
        disabled
        className="w-full bg-primary text-white rounded-md px-5 py-3 text-sm font-medium opacity-50 cursor-not-allowed"
      >
        이 작물로 결정 (Day 4 활성화)
      </button>
    </div>
  );
}
