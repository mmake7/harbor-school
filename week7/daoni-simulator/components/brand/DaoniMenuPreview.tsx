import Link from "next/link";
import { CROPS, type Crop } from "@/data/crops";

type Props = {
  currentCropId?: Crop["id"];
};

export function DaoniMenuPreview({ currentCropId = "strawberry" }: Props) {
  const crop = CROPS.find((c) => c.id === currentCropId) ?? CROPS[0];

  return (
    <div className="mx-auto w-full max-w-[480px] bg-hanji-bg border-[0.5px] border-hanji-border rounded-lg p-6">
      <div className="flex items-baseline justify-between mb-1">
        <div className="text-[10px] tracking-[0.18em] text-muted uppercase">Menu</div>
        <div className="text-[10px] tracking-[0.16em] text-muted uppercase">
          Q{crop.quarter} · {crop.monthRange}
        </div>
      </div>
      <div className="text-xl font-bold text-ink mb-5">지금 메뉴</div>

      <ul className="space-y-3">
        <MenuRow
          label={crop.name}
          sub="오늘 수확"
          price={crop.defaultPrice}
          color={crop.color}
        />
        {crop.honey && (
          <MenuRow
            label={crop.honey.name}
            sub="부산물 · 꿀"
            price={crop.honey.price}
            color={crop.color}
            mute
          />
        )}
      </ul>

      <Link
        href="/shop"
        className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark"
      >
        전체 메뉴 보기 <i className="ti ti-arrow-right" />
      </Link>
    </div>
  );
}

function MenuRow({
  label,
  sub,
  price,
  color,
  mute,
}: {
  label: string;
  sub: string;
  price: number;
  color: string;
  mute?: boolean;
}) {
  return (
    <li className="flex items-baseline gap-3">
      <span
        className="inline-block w-1.5 h-1.5 rounded-full flex-none translate-y-[-2px]"
        style={{ background: mute ? "transparent" : color, border: mute ? `1px solid ${color}` : undefined }}
      />
      <div className="min-w-0 flex-none">
        <div className="text-sm font-medium text-ink leading-tight">{label}</div>
        <div className="text-[11px] text-muted leading-tight">{sub}</div>
      </div>
      <span
        className="flex-1 self-end mb-[6px] border-b border-dotted border-hanji-border"
        aria-hidden
      />
      <div className="font-mono text-sm text-ink tabular-nums">
        ₩{price.toLocaleString()}
      </div>
    </li>
  );
}
