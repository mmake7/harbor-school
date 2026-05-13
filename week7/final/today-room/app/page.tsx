import Link from "next/link"
import Image from "next/image"
import { CATEGORIES } from "@/types/database.types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

type RecentRow = {
  id: string
  title: string
  price: number
  category: string
  images: string[]
}

async function fetchRecent(): Promise<RecentRow[]> {
  try {
    const r = await query<RecentRow>(
      `SELECT id, title, price, category, images
         FROM tr_products
        ORDER BY created_at DESC
        LIMIT 5`
    )
    return r.rows
  } catch {
    return []
  }
}

export default async function HomePage() {
  const recent = await fetchRecent()

  return (
    <main className="container mx-auto p-6">
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">today-room</h1>
        <p className="text-muted-foreground mt-2">동네 친구에게 거래하는 인테리어 마켓</p>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">카테고리</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/products?category=${c.id}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center font-medium">{c.label}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">최근 상품</h2>
          <Link href="/products" className="text-xs text-muted-foreground underline">전체 보기</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-muted-foreground text-sm">아직 등록된 상품이 없어요</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {recent.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <Card className="hover:shadow-md transition">
                  <div className="relative aspect-square bg-muted">
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.title} fill sizes="200px" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">no image</div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="text-sm font-medium line-clamp-1">{p.title}</div>
                    <div className="text-base font-bold">₩{p.price.toLocaleString()}</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {CATEGORIES.find((c) => c.id === p.category)?.label || p.category}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
