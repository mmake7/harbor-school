"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { Suspense } from "react"
import { CATEGORIES, type Category, type Product } from "@/types/database.types"
import { apiGet } from "@/lib/auth-client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function ProductsListInner() {
  const router = useRouter()
  const params = useSearchParams()
  const category = params.get("category") as Category | null
  const q = params.get("q") || ""

  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState(q)

  React.useEffect(() => {
    setLoading(true)
    const qs = new URLSearchParams()
    if (category) qs.set("category", category)
    if (q) qs.set("q", q)
    apiGet<{ products: Product[] }>(`/api/products?${qs.toString()}`).then((r) => {
      if (r.ok) setProducts(r.data.products || [])
      setLoading(false)
    })
  }, [category, q])

  function applyCategory(c: Category | null) {
    const qs = new URLSearchParams()
    if (c) qs.set("category", c)
    if (q) qs.set("q", q)
    router.push(`/products${qs.toString() ? `?${qs.toString()}` : ""}`)
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault()
    const qs = new URLSearchParams()
    if (category) qs.set("category", category)
    if (search.trim()) qs.set("q", search.trim())
    router.push(`/products${qs.toString() ? `?${qs.toString()}` : ""}`)
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">상품 목록</h1>

      <form onSubmit={applySearch} className="flex gap-2 mb-4">
        <Input
          placeholder="제목 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit">검색</Button>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        <Badge
          variant={!category ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => applyCategory(null)}
        >전체</Badge>
        {CATEGORIES.map((c) => (
          <Badge
            key={c.id}
            variant={category === c.id ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => applyCategory(c.id)}
          >{c.label}</Badge>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">로딩…</p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">등록된 상품이 없음</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <div className="relative aspect-square bg-muted">
                  {p.images[0] ? (
                    <Image src={p.images[0]} alt={p.title} fill sizes="200px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">no image</div>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="text-sm font-medium line-clamp-1">{p.title}</div>
                  <div className="text-base font-bold mt-1">₩{p.price.toLocaleString()}</div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {CATEGORIES.find((c) => c.id === p.category)?.label || p.category}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default function ProductsListPage() {
  return (
    <main className="container mx-auto p-6">
      <Suspense fallback={<p className="text-muted-foreground">로딩…</p>}>
        <ProductsListInner />
      </Suspense>
    </main>
  )
}
