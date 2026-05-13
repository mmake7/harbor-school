"use client";

import * as React from "react";

type Briefing = {
  greeting: string;
  farmStatus: string;
  todayPlan: string[];
  weatherNote: string;
  seasonOutlook: string;
};

export function AdminBriefingCard({ day }: { day: number }) {
  const [state, setState] = React.useState<"loading" | "success" | "error">("loading");
  const [data, setData] = React.useState<Briefing | null>(null);
  const [err, setErr] = React.useState("");
  const [reload, setReload] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    setState("loading");
    fetch(`/api/briefing/today?day=${day}`)
      .then(async (r) => {
        const json = await r.json();
        if (cancelled) return;
        if (!r.ok) {
          setErr(json?.error ?? `HTTP ${r.status}`);
          setState("error");
          return;
        }
        setData(json as Briefing);
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
      <div className="bg-ink rounded-lg p-6 animate-pulse">
        <div className="h-3 w-1/4 bg-white/10 rounded mb-3" />
        <div className="h-6 w-2/3 bg-white/20 rounded mb-3" />
        <div className="h-4 w-1/2 bg-white/10 rounded" />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="bg-ink rounded-lg p-6 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-white/70 text-xs mb-1">다온이 일일 브리핑</div>
          <div className="text-white/90 text-sm">다온이가 잠시 자리를 비웠어요.</div>
          <div className="text-white/40 text-xs mt-1 font-mono truncate">
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
  return (
    <div className="bg-ink text-white rounded-lg p-6 space-y-5">
      <div className="flex gap-3 items-start">
        <span className="block w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
        <div className="flex-1">
          <div className="text-white/60 text-xs mb-1">다온이 일일 브리핑</div>
          <div className="text-xl md:text-2xl font-bold text-white leading-snug">
            {r.greeting}
          </div>
        </div>
      </div>

      <div className="text-white/90 text-sm leading-relaxed pl-5">
        {r.farmStatus}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 pl-5">
        <div>
          <div className="text-white/50 text-xs mb-1.5">오늘 할 일</div>
          <ul className="text-sm text-white/90 space-y-1">
            {r.todayPlan.map((p, i) => (
              <li key={i}>· {p}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-white/50 text-xs mb-1.5">날씨</div>
          <div className="text-sm text-white/90">{r.weatherNote}</div>
        </div>
        <div>
          <div className="text-white/50 text-xs mb-1.5">시즌 전망</div>
          <div className="text-sm text-white/90">{r.seasonOutlook}</div>
        </div>
      </div>
    </div>
  );
}
