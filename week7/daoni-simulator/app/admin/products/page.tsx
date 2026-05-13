import { CROPS } from "@/data/crops";

export default function ProductsAdminPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">상품</h1>
        <p className="text-sm text-muted mt-1">오늘 등록한 상품을 확인해요.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {CROPS.map((c) => (
          <div key={c.id} className="bg-base border-[0.5px] border-border rounded-lg p-4">
            <div className="aspect-square rounded-md bg-surface mb-3 border-[0.5px] border-border" />
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
              <span className="text-xs text-muted">Q{c.quarter}</span>
            </div>
            <div className="text-ink font-medium">{c.name}</div>
            <div className="inline-block mt-2 bg-primary-light text-primary-dark text-xs font-medium rounded-full px-2 py-0.5">
              다온이가 등록함
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
