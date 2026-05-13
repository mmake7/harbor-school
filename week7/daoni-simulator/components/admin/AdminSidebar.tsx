import Link from "next/link";

const items = [
  { href: "/admin",          label: "대시보드", icon: "ti-layout-dashboard" },
  { href: "/admin/farm",     label: "농장",     icon: "ti-plant-2" },
  { href: "/admin/decide",   label: "결정",     icon: "ti-bulb" },
  { href: "/admin/harvest",  label: "수확",     icon: "ti-basket" },
  { href: "/admin/products", label: "상품",     icon: "ti-package" },
  { href: "/admin/orders",   label: "주문",     icon: "ti-receipt" },
  { href: "/admin/content",  label: "콘텐츠",   icon: "ti-message" },
  { href: "/admin/daoni",    label: "다온이",   icon: "ti-robot" },
];

export function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-surface min-h-screen">
      <nav className="flex flex-col gap-1 p-3 text-sm">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-muted hover:bg-base hover:text-ink"
          >
            <i className={`ti ${it.icon}`} />
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
