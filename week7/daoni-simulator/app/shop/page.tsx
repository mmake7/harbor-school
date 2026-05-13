import Link from "next/link";
import { CROPS } from "@/data/crops";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function ShopPage() {
  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-ink mb-6">상품 목록</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {CROPS.map((c) => (
            <Link key={c.id} href={`/shop/${c.id}`}>
              <article className="bg-base border-[0.5px] border-border rounded-lg p-4 hover:border-border-strong">
                <div
                  className="aspect-square rounded-md bg-surface mb-3 border-[0.5px] border-border"
                  aria-label="상품 이미지 자리"
                />
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: c.color }}
                  />
                  <span className="text-xs text-muted">
                    Q{c.quarter} · {c.monthRange}
                  </span>
                </div>
                <div className="text-ink font-medium mt-1">{c.name}</div>
                <div className="font-mono text-sm text-muted mt-1">가격 단계 6 이후</div>
              </article>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
