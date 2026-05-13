import { RECIPES } from "@/data/recipes";
import { CROPS, type Crop } from "@/data/crops";

type Props = { count?: number; cropFilter?: Crop["id"] };

export function RecipePreviewGrid({ count = 6, cropFilter }: Props) {
  const list = (
    cropFilter ? RECIPES.filter((r) => r.crop === cropFilter) : RECIPES
  ).slice(0, count);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {list.map((r) => {
        const crop = CROPS.find((c) => c.id === r.crop);
        return (
          <div
            key={r.id}
            className="bg-base border-[0.5px] border-border rounded-lg p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: crop?.color }}
              />
              <span className="text-xs text-muted">{crop?.name}</span>
            </div>
            <div className="text-sm text-ink font-medium">{r.name}</div>
            <div className="text-xs text-muted mt-1 font-mono">
              ⏱ {r.time_min}분 · 재료 {r.ingredients.length}
            </div>
            <div className="text-xs text-muted mt-1 truncate">
              {r.method_short}
            </div>
          </div>
        );
      })}
    </div>
  );
}
