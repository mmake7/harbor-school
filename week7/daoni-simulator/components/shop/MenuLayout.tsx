"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Crop } from "@/data/crops";
import type { Quarter } from "@/data/seed-quarters";
import {
  saveReservation,
  hasReserved,
  makeReservationId,
  getDaoniReservationMessage,
} from "@/lib/reserve";

type Props = {
  crops: Crop[];
  quarters: Quarter[];
  currentQuarterId?: Quarter["id"];
};

const SEASON_BG: Record<Quarter["id"], string> = {
  Q1: "bg-season-q1",
  Q2: "bg-season-q2",
  Q3: "bg-season-q3",
  Q4: "bg-season-q4",
};

export function MenuLayout({ crops, quarters, currentQuarterId }: Props) {
  return (
    <div className="bg-hanji-bg border-[0.5px] border-hanji-border rounded-lg p-6 sm:p-10">
      {/* 메뉴판 헤더 */}
      <div className="text-center mb-10 pb-6 border-b border-hanji-border">
        <div className="text-[10px] tracking-[0.22em] text-muted uppercase">
          Daoni · Seasonal Menu
        </div>
        <h1 className="text-3xl font-bold text-ink tracking-tight mt-2">
          다온이의 시즌 메뉴
        </h1>
        <p className="text-sm text-muted mt-2">
          지금 수확 중인 작물과 부산물 꿀
        </p>
      </div>

      {/* 시즌 섹션 4개 */}
      <div className="space-y-10">
        {quarters.map((q) => {
          const crop = crops.find((c) => c.id === q.cropId);
          if (!crop) return null;
          const isCurrent = q.id === currentQuarterId;
          return (
            <SeasonSection
              key={q.id}
              quarter={q}
              crop={crop}
              isCurrent={isCurrent}
            />
          );
        })}
      </div>

      {/* 하단 마감 라인 */}
      <div className="mt-12 pt-6 border-t border-hanji-border text-center">
        <div className="text-[10px] tracking-[0.18em] text-muted-light uppercase">
          염창동 옥상농장 · 1인 운영
        </div>
      </div>
    </div>
  );
}

function SeasonSection({
  quarter,
  crop,
  isCurrent,
}: {
  quarter: Quarter;
  crop: Crop;
  isCurrent: boolean;
}) {
  const sectionClass = isCurrent
    ? "border-2 rounded-md p-5"
    : "opacity-60 p-5";
  const sectionStyle = isCurrent
    ? { borderColor: crop.color }
    : undefined;

  const reservable = !isCurrent && crop.id !== "sprout";

  return (
    <section className={sectionClass} style={sectionStyle}>
      {/* 시즌 헤더 */}
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-baseline gap-3">
          <span
            className={`inline-block w-2 h-2 rounded-full ${SEASON_BG[quarter.id]} translate-y-[-2px]`}
          />
          <h2 className="text-sm font-bold tracking-[0.16em] uppercase text-ink">
            {quarter.id} · {quarter.season}
          </h2>
          <span className="text-xs text-muted">{quarter.monthRange}</span>
        </div>
        {isCurrent ? (
          <span
            className="text-[10px] font-bold tracking-wider uppercase text-white px-2 py-0.5 rounded-full"
            style={{ background: crop.color }}
          >
            Now
          </span>
        ) : (
          <span className="text-[10px] tracking-wider uppercase text-muted-light">
            곧 만나요
          </span>
        )}
      </div>

      {/* 작물 + 꿀 행 */}
      <ul className="space-y-3">
        <MenuRow
          href={`/shop/${crop.id}`}
          imageSrc={`/seed-images/${crop.id}.png`}
          label={crop.name}
          sub={`${crop.growthDays}일 키워서 갓 수확`}
          price={crop.defaultPrice}
          color={crop.color}
          isCurrent={isCurrent}
        />
        {crop.honey && (
          <MenuRow
            href={`/shop/${crop.id}`}
            imageSrc={`/seed-images/${crop.id}-honey.png`}
            label={crop.honey.name}
            sub="부산물 · 꿀"
            price={crop.honey.price}
            color={crop.color}
            isCurrent={isCurrent}
            honey
          />
        )}
      </ul>

      {reservable && <ReserveSlot cropId={crop.id} color={crop.color} />}
    </section>
  );
}

function MenuRow({
  href,
  imageSrc,
  label,
  sub,
  price,
  color,
  isCurrent,
  honey,
}: {
  href: string;
  imageSrc: string;
  label: string;
  sub: string;
  price: number;
  color: string;
  isCurrent: boolean;
  honey?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-3 py-1 hover:text-primary-dark"
      >
        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-none border-[0.5px] border-hanji-border bg-base">
          <Image
            src={imageSrc}
            alt={label}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-none">
          <div className="flex items-baseline gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                background: honey ? "transparent" : color,
                border: honey ? `1px solid ${color}` : undefined,
              }}
            />
            <span className="text-base font-medium text-ink leading-tight group-hover:text-primary-dark">
              {label}
            </span>
          </div>
          <div className="text-[11px] text-muted leading-tight ml-3">{sub}</div>
        </div>
        <span
          className="flex-1 self-end mb-[14px] border-b border-dotted border-hanji-border"
          aria-hidden
        />
        <div className="font-mono text-base text-ink tabular-nums">
          {isCurrent ? `₩${price.toLocaleString()}` : <span className="text-muted-light">—</span>}
        </div>
      </Link>
    </li>
  );
}

function ReserveSlot({
  cropId,
  color,
}: {
  cropId: Crop["id"];
  color: string;
}) {
  const [reserved, setReserved] = React.useState(false);

  React.useEffect(() => {
    if (hasReserved(cropId)) setReserved(true);
  }, [cropId]);

  function handleReserve() {
    saveReservation({
      reservationId: makeReservationId(),
      cropId,
      reservedAt: new Date().toISOString(),
      quantity: 1,
      status: "pending",
    });
    setReserved(true);
  }

  return (
    <div className="mt-4 ml-[60px]">
      {reserved ? (
        <div className="bg-ink text-white rounded-md p-3 text-sm flex gap-2">
          <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
          <div>
            <div className="font-medium text-white">✓ 예약 완료</div>
            <div className="text-white/80 text-xs mt-1">
              {getDaoniReservationMessage(cropId)}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleReserve}
          className="text-xs rounded-md px-3 py-1.5 border hover:bg-white transition"
          style={{ borderColor: color, color }}
        >
          예약하기
        </button>
      )}
    </div>
  );
}
