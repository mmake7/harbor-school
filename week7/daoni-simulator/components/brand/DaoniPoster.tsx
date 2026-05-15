import Image from "next/image";
import { FARM } from "@/data/farm";
import { CROPS, type Crop } from "@/data/crops";

type Props = {
  cropId?: Crop["id"];
  headline?: string;
};

const QUARTER_LABEL: Record<1 | 2 | 3 | 4, string> = {
  1: "Q1 첫 수확 임박",
  2: "Q2 베리 시즌",
  3: "Q3 한여름 멜론",
  4: "Q4 모종 준비",
};

export function DaoniPoster({ cropId = "strawberry", headline }: Props) {
  const crop = CROPS.find((c) => c.id === cropId) ?? CROPS[0];
  const head = headline ?? QUARTER_LABEL[crop.quarter];

  return (
    <div className="mx-auto w-full max-w-[420px] aspect-[4/5] bg-hanji-bg border-[0.5px] border-hanji-border rounded-lg overflow-hidden flex flex-col">
      {/* 헤더 — 빅 타이포 */}
      <div className="px-7 pt-7 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: crop.color }}
          />
          <span className="text-[10px] tracking-[0.18em] text-muted uppercase">
            {FARM.neighborhood} · {crop.monthRange}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-ink leading-tight tracking-tight">
          {head}
        </h2>
      </div>

      {/* 메인 비주얼 — 작물 사진 + 시즌 컬러 오버레이 */}
      <div className="flex-1 mx-7 rounded-md flex items-end p-6 relative overflow-hidden">
        <Image
          src={`/seed-images/${crop.id}.png`}
          alt={crop.name}
          fill
          sizes="420px"
          className="object-cover"
        />
        {/* 시즌 컬러 오버레이 */}
        <div
          className="absolute inset-0"
          style={{ background: crop.color, opacity: 0.55, mixBlendMode: "multiply" }}
          aria-hidden
        />
        {/* 가독성 보강 — 하단 어둡게 */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent"
          aria-hidden
        />
        <div className="relative">
          <div className="text-[10px] tracking-[0.18em] text-white/85 uppercase mb-1">
            Crop
          </div>
          <div className="text-4xl font-bold text-white tracking-tight leading-none drop-shadow-sm">
            {crop.name}
          </div>
        </div>
      </div>

      {/* 푸터 — 농장 + 다온이 한 줄 */}
      <div className="px-7 py-5">
        <div className="text-[11px] text-muted leading-snug mb-2">
          {FARM.name} · {FARM.placement}
        </div>
        <div className="text-[12px] text-ink leading-relaxed border-l-2 border-primary pl-3">
          데이터로 키우고 솔직하게 팝니다. — 다온이
        </div>
      </div>
    </div>
  );
}
