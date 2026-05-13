import Link from "next/link";
import { CROPS } from "@/data/crops";
import { QUARTERS } from "@/data/seed-quarters";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const CURRENT_DAY = 30; // Day 3+ TimeEngine 연결 시 dynamic

export default function ShopPage() {
  const currentQuarter = QUARTERS.find(
    (q) => CURRENT_DAY >= q.dayRange[0] && CURRENT_DAY <= q.dayRange[1]
  );
  const currentCrop = CROPS.find((c) => c.id === currentQuarter?.cropId);
  const otherCrops = CROPS.filter((c) => c.id !== currentCrop?.id);

  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-10 space-y-12">
        <section>
          <h1 className="text-2xl font-bold text-ink mb-1">쇼핑몰</h1>
          <p className="text-sm text-muted">
            지금 다오니가 키우고 있는 작물과 부산물 꿀이에요.
          </p>
        </section>

        {/* 현재 시즌 작물 + 꿀 — 큰 카드 2개 */}
        {currentCrop && (
          <section>
            <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
              지금 수확 중
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 작물 큰 카드 */}
              <Link href={`/shop/${currentCrop.id}`}>
                <div className="bg-base border-[0.5px] border-border rounded-lg p-6 hover:border-border-strong">
                  <div
                    className="aspect-square rounded-md mb-4 border-[0.5px] border-border"
                    style={{ background: currentCrop.color, opacity: 0.85 }}
                    aria-label="작물 컬러 자리"
                  />
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: currentCrop.color }}
                    />
                    <span className="text-xs text-muted">
                      Q{currentCrop.quarter} · {currentCrop.monthRange}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-ink">{currentCrop.name}</div>
                  <div className="font-mono text-2xl text-ink mt-2">
                    ₩{currentCrop.defaultPrice.toLocaleString()}
                  </div>
                  <div className="inline-block mt-3 bg-primary text-white text-xs font-medium rounded-full px-3 py-1">
                    <i className="ti ti-shopping-cart mr-1" />
                    상세 보기
                  </div>
                </div>
              </Link>

              {/* 꿀 큰 카드 (있을 때만) */}
              {currentCrop.honey && (
                <Link href={`/shop/${currentCrop.id}`}>
                  <div className="bg-base border-[0.5px] border-border rounded-lg p-6 hover:border-border-strong">
                    <div
                      className="aspect-square rounded-md mb-4 border-[0.5px] border-border bg-primary-light"
                      aria-label="꿀 자리"
                    />
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-dark" />
                      <span className="text-xs text-muted">부산물 · 꿀</span>
                    </div>
                    <div className="text-xl font-bold text-ink">
                      {currentCrop.honey.name}
                    </div>
                    <div className="font-mono text-2xl text-ink mt-2">
                      ₩{currentCrop.honey.price.toLocaleString()}
                    </div>
                    <div className="inline-block mt-3 bg-primary text-white text-xs font-medium rounded-full px-3 py-1">
                      <i className="ti ti-shopping-cart mr-1" />
                      상세 보기
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* 다른 시즌 — 곧 만나요 */}
        <section>
          <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
            곧 만나요
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {otherCrops.map((c) => (
              <Link key={c.id} href={`/shop/${c.id}`}>
                <div className="bg-base border-[0.5px] border-border rounded-lg p-4 opacity-60 hover:opacity-100 hover:border-border-strong transition">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: c.color }}
                    />
                    <span className="text-xs text-muted">
                      Q{c.quarter} · {c.monthRange}
                    </span>
                  </div>
                  <div className="text-ink font-medium">{c.name}</div>
                  <div className="font-mono text-sm text-muted mt-1">
                    ₩{c.defaultPrice.toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
