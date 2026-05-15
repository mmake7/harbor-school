import Link from "next/link";
import Image from "next/image";
import { CROPS } from "@/data/crops";
import { QUARTERS } from "@/data/seed-quarters";

type Props = { currentDay: number };

export function SeasonalProductGrid({ currentDay }: Props) {
  const currentQuarter = QUARTERS.find(
    (q) => currentDay >= q.dayRange[0] && currentDay <= q.dayRange[1]
  );
  const currentCropId = currentQuarter?.cropId;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {CROPS.map((crop) => {
        const isCurrent = crop.id === currentCropId;
        return (
          <Link key={crop.id} href={`/shop/${crop.id}`}>
            <div
              className={`bg-base border-[0.5px] border-border rounded-lg overflow-hidden hover:border-border-strong transition ${
                isCurrent ? "" : "opacity-60"
              }`}
            >
              <div className="relative aspect-square bg-surface">
                <Image
                  src={`/seed-images/${crop.id}.png`}
                  alt={crop.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                {isCurrent && (
                  <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-medium rounded-full px-2 py-0.5">
                    지금 수확 중
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: crop.color }}
                  />
                  <span className="text-xs text-muted">
                    Q{crop.quarter} · {crop.monthRange}
                  </span>
                </div>
                <div className="font-medium text-ink">{crop.name}</div>
                <div className="text-xs text-muted mt-1">{crop.growthDays}일 생육</div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
