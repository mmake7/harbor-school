import { FarmStatusCard } from "@/components/admin/FarmStatusCard";
import { DaoniActionLog } from "@/components/admin/DaoniActionLog";

const DEFAULT_DAY = 30;

export default function FarmPage({
  searchParams,
}: {
  searchParams: { day?: string };
}) {
  const raw = searchParams.day;
  const parsed = raw ? parseInt(raw, 10) : DEFAULT_DAY;
  const day = Math.max(1, Math.min(365, Number.isFinite(parsed) ? parsed : DEFAULT_DAY));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">농장</h1>
        <p className="text-sm text-muted mt-1">
          저는 매 시간 농장을 보고 있어요. (Day {day})
        </p>
      </header>

      <FarmStatusCard day={day} />
      <DaoniActionLog day={day} />
    </div>
  );
}
