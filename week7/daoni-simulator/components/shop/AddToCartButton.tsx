"use client";

import * as React from "react";
import { addItem, type CartItem } from "@/lib/cart";

type Props = {
  item: Omit<CartItem, "qty">;
  qty?: number;
  label?: string;
};

export function AddToCartButton({ item, qty = 1, label = "장바구니에 담기" }: Props) {
  const [added, setAdded] = React.useState(false);

  function handleClick() {
    addItem(item, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      onClick={handleClick}
      disabled={added}
      className="bg-primary text-white text-sm font-medium rounded-md px-5 py-2.5 hover:bg-primary-dark disabled:opacity-70"
    >
      {added ? "담겼어요" : label}
    </button>
  );
}
