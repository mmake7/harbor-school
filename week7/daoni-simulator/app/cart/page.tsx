"use client";

import * as React from "react";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { getCart, updateQty, removeItem, getTotal, type CartItem } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setItems(getCart());
    setMounted(true);
  }, []);

  function onQty(id: string, delta: number) {
    const cur = items.find((i) => i.id === id);
    if (!cur) return;
    const next = updateQty(id, cur.qty + delta);
    setItems(next);
  }

  function onRemove(id: string) {
    setItems(removeItem(id));
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

  const total = getTotal(items);

  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-ink mb-6">장바구니</h1>

        {items.length === 0 ? (
          <div className="bg-base border-[0.5px] border-border rounded-lg p-10 text-center">
            <i className="ti ti-shopping-cart text-4xl text-muted-light" />
            <p className="text-muted mt-3">아직 비었어요.</p>
            <Link
              href="/shop"
              className="inline-block mt-4 bg-primary text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-primary-dark"
            >
              쇼핑몰로
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="bg-base border-[0.5px] border-border rounded-lg p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-ink font-medium">{it.name}</div>
                    <div className="text-xs text-muted">
                      {it.itemType === "honey" ? "🍯 꿀" : "🌱 작물"} · 단가 ₩
                      {it.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onQty(it.id, -1)}
                      className="w-7 h-7 border-[0.5px] border-border rounded-md text-ink hover:bg-surface"
                      aria-label="수량 감소"
                    >
                      −
                    </button>
                    <span className="font-mono text-sm w-6 text-center">{it.qty}</span>
                    <button
                      onClick={() => onQty(it.id, 1)}
                      className="w-7 h-7 border-[0.5px] border-border rounded-md text-ink hover:bg-surface"
                      aria-label="수량 증가"
                    >
                      +
                    </button>
                  </div>
                  <div className="font-mono text-sm text-ink w-24 text-right shrink-0">
                    ₩{(it.price * it.qty).toLocaleString()}
                  </div>
                  <button
                    onClick={() => onRemove(it.id)}
                    className="text-xs text-muted-light hover:text-ink shrink-0"
                    aria-label="삭제"
                  >
                    제거
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-surface border-[0.5px] border-border rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm text-muted">합계</span>
              <span className="font-mono text-2xl font-bold text-ink">
                ₩{total.toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              className="block mt-4 bg-primary text-white rounded-md px-5 py-3 text-sm font-medium text-center hover:bg-primary-dark"
            >
              결제하기
            </Link>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
