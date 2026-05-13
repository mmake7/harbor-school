import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function CheckoutPage() {
  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-ink mb-6">결제</h1>
        <div className="bg-surface border-[0.5px] border-border rounded-lg p-8 text-center">
          <div className="text-xs text-muted mb-2">TossPayments 위젯 자리</div>
          <p className="text-muted">
            실제 결제 흐름은 단계 6 이후 today-room 패턴으로 연결돼요.
          </p>
        </div>
        <Link
          href="/order/test-001"
          className="block mt-6 bg-primary text-white rounded-md px-5 py-3 text-sm font-medium text-center hover:bg-primary-dark"
        >
          주문 완료로 이동 (placeholder)
        </Link>
      </main>
      <Footer />
    </>
  );
}
