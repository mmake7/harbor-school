// 손님 카트 + 주문 — localStorage 기반 (DB 안 씀, 단순 유틸)
// 모든 호출은 브라우저에서만 의미 있음 (SSR 가드 포함)

export type CartItem = {
  id: string;            // cropId 또는 honeyId
  name: string;
  price: number;
  itemType: "crop" | "honey";
  qty: number;
};

const CART_KEY = "daoni-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function addItem(item: Omit<CartItem, "qty">, qty = 1): CartItem[] {
  const cart = getCart();
  const i = cart.findIndex((c) => c.id === item.id);
  if (i >= 0) {
    cart[i].qty += qty;
  } else {
    cart.push({ ...item, qty });
  }
  setCart(cart);
  return cart;
}

export function updateQty(id: string, qty: number): CartItem[] {
  const cart = getCart();
  const i = cart.findIndex((c) => c.id === id);
  if (i < 0) return cart;
  if (qty <= 0) {
    cart.splice(i, 1);
  } else {
    cart[i].qty = qty;
  }
  setCart(cart);
  return cart;
}

export function removeItem(id: string): CartItem[] {
  return updateQty(id, 0);
}

export function clearCart(): void {
  setCart([]);
}

export function getTotal(items?: CartItem[]): number {
  return (items ?? getCart()).reduce((s, c) => s + c.price * c.qty, 0);
}

// ---- 주문 ----

export type ShipInfo = { name: string; phone: string; address: string };

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  ship: ShipInfo;
  createdAt: string; // ISO
};

const ORDERS_KEY = "daoni-orders";

export function makeOrderId(): string {
  if (typeof window !== "undefined" && typeof crypto !== "undefined" && crypto.randomUUID) {
    return `daoni-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `daoni-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    const all = raw ? (JSON.parse(raw) as Order[]) : [];
    all.push(order);
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function getOrder(id: string): Order | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    const all = raw ? (JSON.parse(raw) as Order[]) : [];
    return all.find((o) => o.id === id) ?? null;
  } catch {
    return null;
  }
}
