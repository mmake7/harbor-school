import { RECIPES } from "@/data/recipes";
import { CROPS } from "@/data/crops";

export function TodayTableCard() {
  const r = RECIPES[0];
  const crop = CROPS.find((c) => c.id === r.crop);
  return (
    <div className="bg-base border-[0.5px] border-border rounded-lg p-4">
      <div className="text-xs text-muted mb-2">오늘의 다온이 식탁</div>
      <div className="flex gap-4">
        <div
          className="w-16 h-16 rounded-md bg-surface shrink-0 border-[0.5px] border-border"
          aria-label="레시피 이미지 자리"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: crop?.color }}
            />
            <span className="text-xs text-muted">{crop?.name}</span>
          </div>
          <div className="text-ink font-medium mt-0.5">{r.name}</div>
          <div className="text-xs text-muted mt-1">⏱ {r.time_min}분 · {r.method_short}</div>
        </div>
      </div>
    </div>
  );
}
