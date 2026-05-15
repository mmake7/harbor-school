import Image from "next/image";
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
            className="bg-base border-[0.5px] border-border rounded-lg overflow-hidden flex gap-3"
          >
            <div className="relative w-20 h-20 shrink-0 bg-surface">
              <Image
                src={`/seed-images/${r.crop}.png`}
                alt={crop?.name ?? r.crop}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 p-3 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: crop?.color }}
                />
                <span className="text-xs text-muted">{crop?.name}</span>
              </div>
              <div className="text-sm text-ink font-medium truncate">{r.name}</div>
              <div className="text-xs text-muted mt-1 font-mono">
                ⏱ {r.time_min}분 · 재료 {r.ingredients.length}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
