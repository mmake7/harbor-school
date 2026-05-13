import { CROPS } from "@/data/crops";

export default function HarvestPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">수확</h1>
        <p className="text-sm text-muted mt-1">수확 시기는 제가 챙길게요.</p>
      </header>

      <section>
        <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">수확 가능 작물</h2>
        <div className="space-y-2">
          {CROPS.map((c) => (
            <div
              key={c.id}
              className="bg-base border-[0.5px] border-border rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                <div>
                  <div className="text-ink font-medium">{c.name}</div>
                  <div className="text-xs text-muted font-mono">대기 중 · 단계 6 이후 연결</div>
                </div>
              </div>
              <button
                className="bg-primary text-white text-sm font-medium rounded-md px-4 py-1.5 hover:bg-primary-dark disabled:opacity-50"
                disabled
              >
                수확 처리
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
