import { CROPS } from "@/data/crops";

export default function FarmPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">농장</h1>
        <p className="text-sm text-muted mt-1">저는 매 시간 농장을 보고 있어요.</p>
      </header>

      <section>
        <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">작물 생육</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CROPS.map((c) => (
            <div key={c.id} className="bg-base border-[0.5px] border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                <span className="text-xs text-muted">Q{c.quarter} · {c.monthRange}</span>
              </div>
              <div className="text-ink font-medium">{c.name}</div>
              <div className="text-xs text-muted mt-1 font-mono">— / {c.growthDays}일</div>
              <div className="h-1 bg-surface rounded mt-2 overflow-hidden">
                <div className="h-1 rounded" style={{ background: c.color, width: "0%" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">환경 센서</h2>
        <div className="bg-base border-[0.5px] border-border rounded-lg p-6 text-center text-sm text-muted">
          <i className="ti ti-temperature text-2xl text-muted-light" />
          <p className="mt-2">온도 · 습도 · 일조 센서는 단계 6 이후에 연결돼요.</p>
        </div>
      </section>
    </div>
  );
}
