import { CROPS } from "@/data/crops";

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">콘텐츠</h1>
        <p className="text-sm text-muted mt-1">오늘은 이런 콘텐츠 어때요.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CROPS.slice(0, 3).map((c) => (
          <div key={c.id} className="bg-base border-[0.5px] border-border rounded-lg overflow-hidden">
            <div className="aspect-square bg-surface relative">
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-light">
                gpt-image-1 썸네일 자리
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                <span className="text-xs text-muted">{c.name}</span>
              </div>
              <div className="text-sm text-ink">오늘 농장 한 컷 · 캡션은 단계 6에서</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
