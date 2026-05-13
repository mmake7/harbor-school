"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useAuth } from "@/components/auth-provider"
import { apiGet } from "@/lib/auth-client"
import { CATEGORIES, type Product } from "@/types/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type FavoriteRow = {
  id: string  // product id
  title: string
  price: number
  category: string
  images: string[]
  favorited_at: string
}

type OrderRow = {
  id: string
  amount: number
  toss_order_id: string
  payment_method: string | null
  status: "pending" | "paid" | "canceled" | "failed" | string
  paid_at: string | null
  created_at: string
  product_id: string
  product_title: string
  product_images: string[]
}

const STATUS_LABEL: Record<string, string> = {
  paid: "결제 완료",
  pending: "결제 대기",
  canceled: "취소됨",
  failed: "결제 실패",
}

export default function MyPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [myProducts, setMyProducts] = React.useState<Product[]>([])
  const [favorites, setFavorites] = React.useState<FavoriteRow[]>([])
  const [orders, setOrders] = React.useState<OrderRow[]>([])
  const [dataLoading, setDataLoading] = React.useState(true)

  React.useEffect(() => {
    if (!loading && !user) router.push("/auth/login")
  }, [loading, user, router])

  React.useEffect(() => {
    if (!user) return
    Promise.all([
      apiGet<{ products: Product[] }>(`/api/products?limit=100`),
      apiGet<{ favorites: FavoriteRow[] }>(`/api/favorites`),
      apiGet<{ orders: OrderRow[] }>(`/api/orders`),
    ]).then(([p, f, o]) => {
      if (p.ok) setMyProducts((p.data.products || []).filter((x) => x.user_id === user.id))
      if (f.ok) setFavorites(f.data.favorites || [])
      if (o.ok) setOrders(o.data.orders || [])
      setDataLoading(false)
    })
  }, [user])

  if (loading || !user) return <main className="container mx-auto p-6"><p className="text-muted-foreground">로딩…</p></main>

  return (
    <main className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>프로필</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>이메일: {user.email}</p>
          <p>동네: {user.neighborhood || "—"}</p>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-lg font-bold mb-3">내 상품 ({myProducts.length})</h2>
        {dataLoading ? (
          <p className="text-muted-foreground text-sm">로딩…</p>
        ) : myProducts.length === 0 ? (
          <p className="text-muted-foreground text-sm">등록한 상품 없음. <Link href="/products/new" className="underline">상품 등록</Link></p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {myProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <Card className="hover:shadow-md transition">
                  <div className="relative aspect-square bg-muted">
                    {p.images[0] ? (
                      <Image src={p.images[0]} alt={p.title} fill sizes="200px" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">no image</div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="text-sm font-medium line-clamp-1">{p.title}</div>
                    <div className="text-base font-bold">₩{p.price.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">내 주문 ({orders.length})</h2>
        {dataLoading ? (
          <p className="text-muted-foreground text-sm">로딩…</p>
        ) : orders.length === 0 ? (
          <p className="text-muted-foreground text-sm">아직 주문이 없어요</p>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => {
              const when = o.paid_at || o.created_at
              return (
                <Link key={o.id} href={`/products/${o.product_id}`}>
                  <Card className="hover:bg-accent transition">
                    <CardContent className="p-3 flex gap-3">
                      <div className="relative h-16 w-16 bg-muted rounded shrink-0">
                        {o.product_images[0] && (
                          <Image src={o.product_images[0]} alt="" fill sizes="64px" className="object-cover rounded" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-medium line-clamp-1">{o.product_title}</span>
                          <Badge variant={o.status === "paid" ? "default" : "outline"} className="text-xs shrink-0">
                            {STATUS_LABEL[o.status] || o.status}
                          </Badge>
                        </div>
                        <div className="text-base font-bold mt-0.5">₩{o.amount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(when).toLocaleString("ko-KR")} · {o.toss_order_id}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">찜 ({favorites.length})</h2>
        {dataLoading ? (
          <p className="text-muted-foreground text-sm">로딩…</p>
        ) : favorites.length === 0 ? (
          <p className="text-muted-foreground text-sm">찜한 상품 없음</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {favorites.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <Card className="hover:shadow-md transition">
                  <div className="relative aspect-square bg-muted">
                    {p.images[0] ? (
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
