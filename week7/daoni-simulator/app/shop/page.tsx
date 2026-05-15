import { CROPS } from "@/data/crops";
import { QUARTERS } from "@/data/seed-quarters";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { MenuLayout } from "@/components/shop/MenuLayout";

const CURRENT_DAY = 30; // Day 3+ TimeEngine 연결 시 dynamic

export default function ShopPage() {
  const currentQuarter = QUARTERS.find(
    (q) => CURRENT_DAY >= q.dayRange[0] && CURRENT_DAY <= q.dayRange[1]
  );

  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-10">
        <MenuLayout
          crops={CROPS}
          quarters={QUARTERS}
          currentQuarterId={currentQuarter?.id}
        />
      </main>
      <Footer />
    </>
  );
}
