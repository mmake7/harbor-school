"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { FARM } from "@/data/farm";
import { getOrder, type Order } from "@/lib/cart";

export default function OrderDonePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [order, setOrder] = React.useState<Order | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setOrder(getOrder(id));
    setMounted(true);
  }, [id]);

  if (!mounted) {
    return (
      <>
        <Header variant="customer" />
        <main className="container mx-auto px-4 py-10">
          <p className="text-muted text-sm">로딩…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header variant="customer" />
        <main className="container mx-auto px-4 py-10 max-w-xl text-center">
          <h1 className="text-2xl font-bold text-ink mb-2">주문을 찾을 수 없어요</h1>
          <p className="text-sm text-muted mb-6 font-mono">{id}</p>
          <Link
            href="/shop"
            className="inline-block bg-primary text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-primary-dark"
          >
            쇼핑몰로
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-10 max-w-xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-light text-primary-dark text-3xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-ink mt-4">주문이 완료됐어요</h1>
          <p className="text-muted mt-2 font-mono text-xs">{order.id}</p>
        </div>

        <section className="bg-base border-[0.5px] border-border rounded-lg p-4 mt-8">
          <div className="text-xs text-muted mb-2">주문 상세</div>
          <div className="space-y-1.5 text-sm">
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between">
                <span className="text-ink">
                  {it.name} <span className="text-muted">× {it.qty}</span>
                </span>
                <span className="font-mono text-ink">
                  ₩{(it.price * it.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-3 pt-3 flex justify-between">
            <span className="text-sm text-muted">합계</span>
            <span className="font-mono font-bold text-ink">
              ₩{order.total.toLocaleString()}
            </span>
          </div>
        </section>

        <section className="bg-surface border-[0.5px] border-border rounded-lg p-4 mt-3 text-sm text-muted">
          <div className="text-xs text-muted mb-1">배송</div>
          <div className="text-ink">{order.ship.name} · {order.ship.phone}</div>
          <div className="mt-1">{order.ship.address}</div>
        </section>

        <section className="bg-ink text-white rounded-lg p-5 mt-6 flex gap-3">
          <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
          <div className="text-sm leading-relaxed text-white/90">
            <div className="text-white/70 text-xs mb-1">다온이 정산 인사</div>
            <div>
              {order.ship.name}님, 오늘 저희 {FARM.name}에 들러주셔서 감사해요.
              주문 정리해서 가장 신선한 상태로 챙겨드릴게요.
            </div>
          </div>
        </section>

        <div className="text-center mt-6">
          <Link href="/shop" className="text-sm text-muted underline">
            쇼핑몰로 돌아가기
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
