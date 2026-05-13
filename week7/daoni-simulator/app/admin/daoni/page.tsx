import { generateDayState } from "@/data/seed-daily";
import { QUARTERS } from "@/data/seed-quarters";
import { CROPS } from "@/data/crops";
import { DaoniChatUI } from "@/components/admin/DaoniChatUI";

const DEFAULT_DAY = 30;

export default function DaoniChatPage({
  searchParams,
}: {
  searchParams: { day?: string };
}) {
  const parsed = searchParams.day ? parseInt(searchParams.day, 10) : DEFAULT_DAY;
  const day = Math.max(1, Math.min(365, Number.isFinite(parsed) ? parsed : DEFAULT_DAY));
  const ds = generateDayState(day);
  const q = QUARTERS.find((x) => x.id === ds.quarter);
  const crop = q ? CROPS.find((c) => c.id === q.cropId) : undefined;

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-2xl font-bold text-ink">다오니와 대화</h1>
        <p className="text-sm text-muted mt-1">
          {q && crop
            ? `${q.id} ${q.monthRange} · ${crop.name} 시즌 · Day ${day}`
            : `Day ${day}`}
        </p>
      </header>
      <DaoniChatUI day={day} />
    </div>
  );
}
