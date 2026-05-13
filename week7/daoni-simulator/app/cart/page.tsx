import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function CartPage() {
  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-ink mb-6">장바구니</h1>
        <div className="bg-base border-[0.5px] border-border rounded-lg p-10 text-center">
          <i className="ti ti-shopping-cart text-4xl text-muted-light" />
          <p className="text-muted mt-2">장바구니 로직은 단계 6 이후에 연결돼요.</p>
          <Link
            href="/checkout"
            className="inline-block mt-6 bg-primary text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-primary-dark"
          >
            결제하기 (placeholder)
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
