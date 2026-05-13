import Link from "next/link";
import { CROPS, type Crop } from "@/data/crops";
import { TellContentCard } from "@/components/admin/TellContentCard";

const DEFAULT_DAY = 88;
const DEFAULT_CROP: Crop["id"] = "strawberry";
const VALID_IDS: Crop["id"][] = ["strawberry", "blueberry", "melon", "sprout"];

export default function ContentPage({
  searchParams,
}: {
  searchParams: { day?: string; cropId?: string };
}) {
  const dayParsed = searchParams.day ? parseInt(searchParams.day, 10) : DEFAULT_DAY;
  const day = Math.max(1, Math.min(365, Number.isFinite(dayParsed) ? dayParsed : DEFAULT_DAY));
  const cropId = (
    VALID_IDS.includes(searchParams.cropId as Crop["id"])
      ? searchParams.cropId
      : DEFAULT_CROP
  ) as Crop["id"];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">콘텐츠</h1>
        <p className="text-sm text-muted mt-1">
          오늘은 이런 콘텐츠 어때요. (Day {day})
        </p>
      </header>

      {/* 작물 셀렉터 */}
      <div className="flex gap-2 flex-wrap">
        {CROPS.map((c) => {
          const active = c.id === cropId;
          return (
            <Link
              key={c.id}
              href={`/admin/content?day=${day}&cropId=${c.id}`}
              className={`text-sm rounded-md px-3 py-1.5 border-[0.5px] ${
                active
                  ? "bg-ink text-white border-ink"
                  : "bg-base text-ink border-border hover:border-border-strong"
              }`}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                style={{ background: c.color }}
              />
              {c.name}
            </Link>
          );
        })}
      </div>

      <TellContentCard cropId={cropId} day={day} />
    </div>
  );
}
