"use client";

import * as React from "react";
import { CROPS } from "@/data/crops";
import { RECIPES } from "@/data/recipes";

type Recommendation = {
  todayPick: { cropId: string; reasoning: string };
  recipe: { recipeId: string; twist: string };
  pairings: Array<{ type: "honey" | "crop"; id: string; reason: string }>;
};

export function TodayTableCard({ day }: { day: number }) {
  const [state, setState] = React.useState<"loading" | "success" | "error">("loading");
  const [data, setData] = React.useState<Recommendation | null>(null);
  const [err, setErr] = React.useState<string>("");
  const [reload, setReload] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    setState("loading");
    fetch(`/api/recommend/today?day=${day}`)
      .then(async (r) => {
        const json = await r.json();
        if (cancelled) return;
        if (!r.ok) {
          setErr(json?.error ?? `HTTP ${r.status}`);
          setState("error");
          return;
        }
        setData(json as Recommendation);
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
      <div className="bg-base border-[0.5px] border-border rounded-lg p-4">
        <div className="text-xs text-muted mb-2">오늘의 다온이 식탁</div>
        <div className="flex gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-md bg-surface shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-surface rounded" />
            <div className="h-4 w-2/3 bg-surface rounded" />
            <div className="h-3 w-1/2 bg-surface rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="bg-base border-[0.5px] border-border rounded-lg p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-muted mb-1">오늘의 다온이 식탁</div>
          <div className="text-sm text-ink">다온이가 잠시 자리를 비웠어요.</div>
          <div className="text-xs text-muted-light mt-1 font-mono truncate">{err.slice(0, 100)}</div>
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
  const crop = CROPS.find((c) => c.id === r.todayPick.cropId);
  const recipe = RECIPES.find((re) => re.id === r.recipe.recipeId);

  return (
    <div className="space-y-3">
      <div className="bg-base border-[0.5px] border-border rounded-lg p-4">
        <div className="text-xs text-muted mb-2">오늘의 다온이 식탁</div>
        <div className="flex gap-4">
          <div
            className="w-16 h-16 rounded-md shrink-0 border-[0.5px] border-border"
            style={{ background: crop?.color ?? "var(--surface)" }}
            aria-label="작물 컬러 자리"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: crop?.color }}
              />
              <span className="text-xs text-muted">{crop?.name ?? r.todayPick.cropId}</span>
            </div>
            <div className="text-ink font-medium mt-0.5">
              {recipe?.name ?? r.recipe.recipeId}
            </div>
            <div className="text-xs text-muted mt-1">
              {recipe ? `⏱ ${recipe.time_min}분 · ` : ""}{r.recipe.twist}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-ink text-white rounded-lg p-4 flex gap-3">
        <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
        <div className="text-sm leading-relaxed text-white/90">{r.todayPick.reasoning}</div>
      </div>

      {r.pairings.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {r.pairings.map((p, i) => (
            <div
              key={i}
              className="bg-primary-light text-primary-dark text-xs rounded-full px-3 py-1"
            >
              {p.type === "honey" ? "🍯" : "🌱"} {p.id} — {p.reason}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
