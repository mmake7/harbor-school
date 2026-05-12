"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"
import { CATEGORIES, type Product, type Chat } from "@/types/database.types"
import { useAuth } from "@/components/auth-provider"
import { apiGet, apiPost, apiFetch } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type ProductWithSeller = Product & {
  seller_email: string | null
  seller_neighborhood: string | null
}
type FavoriteRow = { id: string }

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [product, setProduct] = React.useState<ProductWithSeller | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [activeImage, setActiveImage] = React.useState(0)
  const [favorited, setFavorited] = React.useState(false)
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    apiGet<{ product?: ProductWithSeller; error?: string }>(`/api/products/${params.id}`).then((r) => {
      if (r.ok && r.data.product) setProduct(r.data.product)
      setLoading(false)
    })
  }, [params.id])

  React.useEffect(() => {
    if (!user) return
    apiGet<{ favorites: FavoriteRow[] }>(`/api/favorites`).then((r) => {
      if (r.ok) setFavorited(r.data.favorites.some((f) => f.id === params.id))
    })
  }, [user, params.id])

  async function toggleFavorite() {
    if (!user) return router.push("/auth/login")
    setBusy(true)
    if (favorited) {
      const res = await apiFetch(`/api/favorites?product_id=${params.id}`, { method: "DELETE" })
      if (res.ok) setFavorited(false)
    } else {
      const r = await apiPost(`/api/favorites`, { product_id: params.id })
      if (r.ok) setFavorited(true)
    }
    setBusy(false)
  }

  async function startChat() {
    if (!user) return router.push("/auth/login")
    setBusy(true)
    const r = await apiPost<{ chat?: Chat; error?: string }>(`/api/chats`, { product_id: params.id })
    setBusy(false)
    if (r.ok && r.data.chat) {
      router.push(`/chat/${r.data.chat.id}`)
    } else {
      toast.error(r.data.error || "채팅방 생성 실패")
    }
  }

  async function buyNow() {
    if (!user) return router.push("/auth/login")
    setBusy(true)
    const r = await apiPost<{ order?: { id: string }; error?: string }>(`/api/orders`, { product_id: params.id })
    setBusy(false)
    if (r.ok && r.data.order) {
      router.push(`/checkout/${r.data.order.id}`)
    } else {
      toast.error(r.data.error || "주문 생성 실패")
    }
  }

  if (loading) return <main className="container mx-auto p-6"><p className="text-muted-foreground">로딩…</p></main>
  if (!product) return <main className="container mx-auto p-6"><p className="text-muted-foreground">상품 없음</p></main>

  const isMine = user && user.id === product.user_id
  const categoryLabel = CATEGORIES.find((c) => c.id === product.category)?.label || product.category

  return (
    <main className="container mx-auto max-w-3xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="relative aspect-square bg-muted rounded overflow-hidden">
            {product.images[activeImage] ? (
              <Image src={product.images[activeImage]} alt={product.title} fill sizes="500px" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">no image</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((u, i) => (
                <button
                  key={u}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 rounded overflow-hidden border-2 ${i === activeImage ? "border-primary" : "border-transparent"}`}
                >
                  <Image src={u} alt={`thumb-${i}`} fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Badge variant="outline" className="mb-2">{categoryLabel}</Badge>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <p className="text-2xl font-bold mt-2">₩{product.price.toLocaleString()}</p>
          </div>

          {product.description && (
            <Card>
              <CardContent className="p-4 text-sm whitespace-pre-wrap">{product.description}</CardContent>
            </Card>
          )}

          <div className="text-sm text-muted-foreground space-y-1">
            <p>판매자: {product.seller_email?.split("@")[0] || "—"}</p>
            <p>동네: {product.seller_neighborhood || "—"}</p>
            <p>등록: {new Date(product.created_at).toLocaleDateString("ko-KR")}</p>
          </div>

          {isMine ? (
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => router.push(`/products/${product.id}/edit`)}>수정</Button>
              <Button variant="destructive" onClick={async () => {
                if (!confirm("정말 삭제할까요?")) return
                const res = await apiFetch(`/api/products/${product.id}`, { method: "DELETE" })
                if (res.ok) {
                  toast.success("삭제됨")
                  router.push("/mypage")
                } else {
                  toast.error("삭제 실패")
                }
              }}>삭제</Button>
            </div>
          ) : user ? (
            <div className="flex flex-col gap-2">
              <Button className="w-full" onClick={buyNow} disabled={busy}>구매하기</Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={startChat} disabled={busy}>채팅 시작</Button>
                <Button variant="outline" onClick={toggleFavorite} disabled={busy}>
                  {favorited ? "♥ 찜 해제" : "♡ 찜"}
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => router.push("/auth/login")}>로그인 후 거래 시작</Button>
          )}
        </div>
      </div>
    </main>
  )
}
