import Link from "next/link";
import { FARM } from "@/data/farm";
import { CROPS } from "@/data/crops";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { TodayTableCard } from "@/components/shared/TodayTableCard";

export default function HomePage() {
  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <h1 className="text-3xl font-bold text-ink">{FARM.tagline}</h1>
          <p className="text-muted mt-2">{FARM.neighborhood} · {FARM.placement}</p>
        </section>

        <section className="mb-10">
          <TodayTableCard />
        </section>

        <section>
          <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">시즌 상품</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CROPS.map((c) => (
              <Link key={c.id} href={`/shop/${c.id}`}>
                <div className="bg-base border-[0.5px] border-border rounded-lg p-4 hover:border-border-strong">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: c.color }}
                    />
                    <span className="text-xs text-muted">
                      Q{c.quarter} · {c.monthRange}
                    </span>
                  </div>
                  <div className="font-medium text-ink">{c.name}</div>
                  <div className="text-xs text-muted mt-1">{c.growthDays}일 생육</div>
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
