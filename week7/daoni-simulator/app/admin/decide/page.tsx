import { DecideRecommendationCard } from "@/components/admin/DecideRecommendationCard";
import { QUARTERS } from "@/data/seed-quarters";
import { MARKET_SIGNALS_BY_QUARTER } from "@/data/mock-market";
import { generateDayState } from "@/data/seed-daily";

const DEFAULT_DAY = 30;

export default function DecidePage({
  searchParams,
}: {
  searchParams: { day?: string };
}) {
  const parsed = searchParams.day ? parseInt(searchParams.day, 10) : DEFAULT_DAY;
  const day = Math.max(1, Math.min(365, Number.isFinite(parsed) ? parsed : DEFAULT_DAY));
  const ds = generateDayState(day);
  const q = QUARTERS.find((x) => x.id === ds.quarter);
  const signals = q ? MARKET_SIGNALS_BY_QUARTER[q.id] ?? [] : [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">결정</h1>
        <p className="text-sm text-muted mt-1">
          {q ? `${q.id} ${q.monthRange} · Day ${day}` : `Day ${day}`} · 시장 신호를 보고 추천합니다.
        </p>
      </header>

      <DecideRecommendationCard day={day} />

      {q && (
        <section>
          <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
            시장 신호 ({q.id} · {q.monthRange})
          </h2>
          <div className="space-y-2">
            {signals.map((s, i) => (
              <div
                key={i}
                className="bg-base border-[0.5px] border-border rounded-lg p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-mono text-muted">{s.date}</div>
                  <div className="text-xs text-primary-dark">{s.trendNote}</div>
                </div>
                {Object.keys(s.cropPrices).length > 0 && (
                  <div className="text-xs font-mono text-ink mt-1">
                    {Object.entries(s.cropPrices)
                      .map(([k, v]) => `${k}: ₩${v.toLocaleString()}`)
                      .join(" · ")}
                  </div>
                )}
                {s.newsItems.slice(0, 2).map((n, j) => (
                  <div key={j} className="text-xs text-muted mt-1.5">
                    📰 {n.headline}{" "}
                    <span className="text-muted-light">({n.source})</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
