"use client";

import * as React from "react";
import Link from "next/link";
import { getListings, type Listing } from "@/lib/sell";
import { AutoListedProductCard } from "@/components/admin/AutoListedProductCard";

export default function ProductsAdminPage() {
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const refresh = () => setListings(getListings().slice().reverse());
    refresh();
    setMounted(true);
    const id = window.setInterval(refresh, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">상품</h1>
        <p className="text-sm text-muted mt-1">
          제가 자동으로 등록한 상품을 확인하세요.
        </p>
      </header>

      {!mounted ? (
        <p className="text-muted text-sm">로딩…</p>
      ) : listings.length === 0 ? (
        <div className="bg-base border-[0.5px] border-border rounded-lg p-10 text-center">
          <i className="ti ti-package text-4xl text-muted-light" />
          <p className="text-muted mt-3">
            아직 등록된 상품이 없어요. 수확하면 다온이가 자동으로 등록할게요.
          </p>
          <Link
            href="/admin/harvest?day=88"
            className="inline-block mt-4 bg-primary text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-primary-dark"
          >
            수확하러 가기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {listings.map((l) => (
            <AutoListedProductCard key={l.listingId} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
