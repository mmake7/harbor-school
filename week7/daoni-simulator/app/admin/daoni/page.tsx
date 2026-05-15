import Image from "next/image";
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
      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-[120px] h-[120px] rounded-2xl overflow-hidden shrink-0 bg-surface border-[0.5px] border-border">
          <Image
            src="/seed-images/daoni-character.png"
            alt="다오니 캐릭터"
            fill
            sizes="120px"
            className="object-cover"
            priority
          />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-ink">다오니와 대화</h1>
          <p className="text-sm text-muted mt-1">
            {q && crop
              ? `${q.id} ${q.monthRange} · ${crop.name} 시즌 · Day ${day}`
              : `Day ${day}`}
          </p>
          <p className="text-xs text-muted-light mt-2 leading-relaxed">
            농장·작물·시즌 무엇이든 편하게 물어봐 주세요.
          </p>
        </div>
      </header>
      <DaoniChatUI day={day} />
    </div>
  );
}
