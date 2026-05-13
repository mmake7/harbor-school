import { HarvestableCropsList } from "@/components/admin/HarvestableCropsList";
import { RecentHarvests } from "@/components/admin/RecentHarvests";
import { generateDayState } from "@/data/seed-daily";
import { QUARTERS } from "@/data/seed-quarters";

const DEFAULT_DAY = 30;

export default function HarvestPage({
  searchParams,
}: {
  searchParams: { day?: string };
}) {
  const raw = searchParams.day;
  const parsed = raw ? parseInt(raw, 10) : DEFAULT_DAY;
  const day = Math.max(1, Math.min(365, Number.isFinite(parsed) ? parsed : DEFAULT_DAY));

  const ds = generateDayState(day);
  const q = QUARTERS.find((x) => x.id === ds.quarter);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">수확</h1>
        <p className="text-sm text-muted mt-1">
          {q ? `${q.id} ${q.monthRange} · Day ${day}` : "—"} · 수확 시기는 제가 챙길게요.
        </p>
      </header>

      <HarvestableCropsList day={day} />
      <RecentHarvests />
    </div>
  );
}
