import Link from "next/link";
import { notFound } from "next/navigation";
import { CROPS } from "@/data/crops";
import { RECIPES } from "@/data/recipes";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const crop = CROPS.find((c) => c.id === params.id);
  if (!crop) notFound();
  const recipes = RECIPES.filter((r) => r.crop === crop.id);

  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className="aspect-square rounded-lg bg-surface border-[0.5px] border-border"
          aria-label="상품 대표 이미지 자리"
        />
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
          <p className="text-muted mt-2">
            생육 {crop.growthDays}일 ·{" "}
            {crop.honey ? `부산물: ${crop.honey.name}` : "부산물 없음"}
          </p>
          <div className="font-mono text-2xl text-ink mt-4">가격 단계 6 이후</div>
          <Link
            href="/cart"
            className="inline-block mt-6 bg-primary text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-primary-dark"
          >
            장바구니에 담기
          </Link>

          {recipes.length > 0 && (
            <section className="mt-10">
              <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
                함께 만들면 좋은 레시피
              </h2>
              <div className="space-y-2">
                {recipes.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="bg-base border-[0.5px] border-border rounded-md p-3"
                  >
                    <div className="text-ink font-medium">{r.name}</div>
                    <div className="text-xs text-muted mt-1">
                      ⏱ {r.time_min}분 · {r.method_short}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
