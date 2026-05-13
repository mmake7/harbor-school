import Link from "next/link";
import { notFound } from "next/navigation";
import { CROPS } from "@/data/crops";
import { RECIPES } from "@/data/recipes";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const crop = CROPS.find((c) => c.id === params.id);
  if (!crop) notFound();
  const recipes = RECIPES.filter((r) => r.crop === crop.id).slice(0, 3);

  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 좌: 이미지 자리 */}
          <div
            className="aspect-square rounded-lg border-[0.5px] border-border"
            style={{ background: crop.color, opacity: 0.85 }}
            aria-label="상품 대표 이미지 자리 (Day 4 Tell 모듈에서 실 이미지)"
          />

          {/* 우: 정보 */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: crop.color }}
              />
              <span className="text-xs text-muted">
                Q{crop.quarter} · {crop.monthRange}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-ink">{crop.name}</h1>
            <div className="font-mono text-3xl text-ink mt-3">
              ₩{crop.defaultPrice.toLocaleString()}
            </div>
            <div className="text-sm text-muted mt-4 space-y-1">
              <div>🌱 생육 {crop.growthDays}일</div>
              <div>📍 염창동 옥상농장 · 4층 옥상 200㎡</div>
              {crop.honey && (
                <div>🍯 부산물 꿀: {crop.honey.name} (₩{crop.honey.price.toLocaleString()})</div>
              )}
            </div>

            <div className="mt-6">
              <AddToCartButton
                item={{
                  id: crop.id,
                  name: crop.name,
                  price: crop.defaultPrice,
                  itemType: "crop",
                }}
              />
            </div>

            <div className="bg-ink text-white rounded-lg p-4 mt-6 flex gap-3">
              <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <div className="text-sm leading-relaxed text-white/90">
                저는 이 {crop.name}이 이번 분기 가장 자신 있어요. 단골님께 가장 신선한
                상태로 보내드릴게요.
              </div>
            </div>
          </section>
        </div>

        {/* 부산물 꿀 카드 */}
        {crop.honey && (
          <section>
            <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
              부산물 꿀
            </h2>
            <div className="bg-base border-[0.5px] border-border rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-md bg-primary-light shrink-0" />
                <div className="min-w-0">
                  <div className="text-ink font-medium">{crop.honey.name}</div>
                  <div className="font-mono text-sm text-muted">
                    ₩{crop.honey.price.toLocaleString()}
                  </div>
                </div>
              </div>
              <AddToCartButton
                item={{
                  id: crop.honey.id,
                  name: crop.honey.name,
                  price: crop.honey.price,
                  itemType: "honey",
                }}
                label="꿀 담기"
              />
            </div>
          </section>
        )}

        {/* 함께 만들면 좋은 레시피 */}
        {recipes.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
              함께 만들면 좋은 레시피
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recipes.map((r) => (
                <div
                  key={r.id}
                  className="bg-base border-[0.5px] border-border rounded-md p-3"
                >
                  <div className="text-ink font-medium">{r.name}</div>
                  <div className="text-xs text-muted mt-1 font-mono">
                    ⏱ {r.time_min}분 · 재료 {r.ingredients.length}
                  </div>
                  <div className="text-xs text-muted mt-1 truncate">
                    {r.method_short}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="text-center">
          <Link href="/shop" className="text-sm text-muted underline">
            ← 쇼핑몰로
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
