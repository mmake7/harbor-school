"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import {
  getCart,
  getTotal,
  saveOrder,
  makeOrderId,
  clearCart,
  type CartItem,
} from "@/lib/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [mounted, setMounted] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    setItems(getCart());
    setMounted(true);
  }, []);

  function canSubmit() {
    return (
      items.length > 0 &&
      name.trim().length > 0 &&
      phone.trim().length > 0 &&
      address.trim().length > 0 &&
      !busy
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit()) return;
    setBusy(true);
    const id = makeOrderId();
    saveOrder({
      id,
      items,
      total: getTotal(items),
      ship: { name: name.trim(), phone: phone.trim(), address: address.trim() },
      createdAt: new Date().toISOString(),
    });
    clearCart();
    router.push(`/order/${id}`);
  }

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

  if (items.length === 0) {
    return (
      <>
        <Header variant="customer" />
        <main className="container mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-ink mb-4">결제</h1>
          <div className="bg-base border-[0.5px] border-border rounded-lg p-10 text-center">
            <p className="text-muted">장바구니가 비어 있어요.</p>
            <Link
              href="/shop"
              className="inline-block mt-4 bg-primary text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-primary-dark"
            >
              쇼핑몰로
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const total = getTotal(items);

  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-2xl font-bold text-ink mb-6">결제</h1>

        <section className="bg-base border-[0.5px] border-border rounded-lg p-4 mb-6">
          <div className="text-xs text-muted mb-2">주문 요약</div>
          <div className="space-y-1.5 text-sm">
            {items.map((it) => (
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
              ₩{total.toLocaleString()}
            </span>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-muted mb-1">받는 사람</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-[0.5px] border-border rounded-md px-3 py-2 text-sm bg-base"
              placeholder="이름"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">전화</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border-[0.5px] border-border rounded-md px-3 py-2 text-sm bg-base"
              placeholder="010-0000-0000"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">주소</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border-[0.5px] border-border rounded-md px-3 py-2 text-sm bg-base"
              placeholder="배송 주소"
            />
          </div>

          <div className="bg-surface border-[0.5px] border-border rounded-md p-3 text-xs text-muted">
            테스트 결제 (실제 결제 X) — TossPayments 실 widget은 이후 단계에 추가돼요.
          </div>

          <button
            type="submit"
            disabled={!canSubmit()}
            className="w-full bg-primary text-white rounded-md px-5 py-3 text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
          >
            {busy ? "처리 중…" : "결제 완료"}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
