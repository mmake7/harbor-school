import Link from "next/link";
import { FARM } from "@/data/farm";

type NavItem = { href: string; label: string; icon?: string };

const customerNav: NavItem[] = [
  { href: "/", label: "홈" },
  { href: "/shop", label: "상품" },
  { href: "/cart", label: "장바구니", icon: "ti-shopping-cart" },
  { href: "/admin", label: "관리자" },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "대시보드" },
  { href: "/", label: "쇼핑몰" },
];

export function Header({ variant = "customer" }: { variant?: "customer" | "admin" }) {
  const nav = variant === "admin" ? adminNav : customerNav;
  return (
    <header className="border-b border-border bg-base">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-ink tracking-tight">
          {FARM.name}
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-1 rounded-md text-muted hover:bg-surface hover:text-ink"
            >
              {n.icon ? <i className={`ti ${n.icon} mr-1`} /> : null}
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
