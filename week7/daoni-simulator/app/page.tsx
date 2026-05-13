import Link from "next/link";
import { FARM } from "@/data/farm";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { TodayTableCard } from "@/components/shared/TodayTableCard";
import { SeasonalProductGrid } from "@/components/shared/SeasonalProductGrid";
import { RecipePreviewGrid } from "@/components/shared/RecipePreviewGrid";

const CURRENT_DAY = 30; // Day 3+ TimeEngine 연결 시 dynamic

export default function HomePage() {
  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-10 space-y-12">
        {/* A. 히어로 */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight leading-tight">
              농부의 AI 운영자,{" "}
              <span className="whitespace-nowrap">
                D<span className="text-primary">A</span>ON
                <span className="text-primary">i</span>
              </span>
            </h1>
            <p className="text-muted mt-4 text-base md:text-lg">{FARM.tagline}</p>
            <div className="flex gap-2 mt-6 justify-center md:justify-start">
              <Link
                href="/shop"
                className="bg-primary text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-primary-dark"
              >
                쇼핑몰 둘러보기
              </Link>
              <Link
                href="/admin/daoni"
                className="border-[0.5px] border-border-strong text-ink rounded-md px-5 py-2.5 text-sm font-medium hover:bg-surface"
              >
                다오니 만나기
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <SignatureMotif />
          </div>
        </section>

        {/* B. 오늘의 다오니 식탁 */}
        <section>
          <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
            오늘
          </h2>
          <TodayTableCard day={CURRENT_DAY} />
        </section>

        {/* C. 시즌 상품 */}
        <section>
          <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
            시즌 상품
          </h2>
          <SeasonalProductGrid currentDay={CURRENT_DAY} />
        </section>

        {/* D. 추천 레시피 */}
        <section>
          <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
            추천 레시피
          </h2>
          <RecipePreviewGrid count={6} />
        </section>

        {/* E. 농장 소개 */}
        <section className="bg-surface border-[0.5px] border-border rounded-lg p-6 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
              농장 소개
            </h2>
            <div className="text-2xl font-bold text-ink">{FARM.name}</div>
            <div className="text-sm text-muted mt-2">{FARM.placement}</div>
            <div className="text-xs text-muted-light mt-2 font-mono">
              시작 {FARM.foundedAt} · {FARM.location}
            </div>
          </div>
          <div className="text-sm text-ink leading-relaxed whitespace-pre-line">
            {FARM.daoniPersona.split("\n").slice(0, 3).join("\n")}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SignatureMotif() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="w-full h-auto"
      role="img"
      aria-label="DAONi 시그니처 — 도시 그리드 × 식물 곡선 × 데이터 도트"
    >
      {/* 도시 그리드 (수직 라인) */}
      {[20, 60, 100, 140, 180].map((x) => (
        <line key={x} x1={x} y1={0} x2={x} y2={160} stroke="#E2E8F0" strokeWidth="0.5" />
      ))}
      {/* 식물 곡선 */}
      <path
        d="M 30 140 Q 80 80 120 100 T 180 60"
        stroke="#10B981"
        strokeWidth="2"
        fill="none"
      />
      {/* 데이터 도트 */}
      <circle cx="50" cy="120" r="3" fill="#10B981" />
      <circle cx="100" cy="95" r="3" fill="#10B981" />
      <circle cx="150" cy="80" r="3" fill="#10B981" />
    </svg>
  );
}
