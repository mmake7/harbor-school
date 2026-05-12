import Link from "next/link"
import { CATEGORIES } from "@/types/database.types"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
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
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">최근 상품</h2>
        <p className="text-muted-foreground text-sm">TODO: 5단계에서 구현 (최신 등록 상품 목록)</p>
      </section>
    </main>
  )
}
