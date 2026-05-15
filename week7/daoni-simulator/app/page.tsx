import Link from "next/link";
import Image from "next/image";
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
      <main>
        {/* A. 히어로 — 풀폭 배경 이미지 */}
        <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
          <Image
            src="/seed-images/farm-overview.png"
            alt={`${FARM.name} 전경`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.25))",
            }}
          />
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
                농부의 AI 운영자,{" "}
                <span className="whitespace-nowrap">
                  D<span className="text-primary">A</span>ON
                  <span className="text-primary">i</span>
                </span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/70">{FARM.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-8">
                <Link
                  href="/shop"
                  className="bg-primary text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-primary-dark"
                >
                  쇼핑몰 둘러보기
                </Link>
                <Link
                  href="/admin/daoni"
                  className="border border-white/80 text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-primary hover:border-primary"
                >
                  다오니 만나기
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 space-y-12">
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
        </div>
      </main>
      <Footer />
    </>
  );
}
