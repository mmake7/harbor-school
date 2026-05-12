import { CATEGORIES } from "@/types/database.types"

export default function ProductsPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">상품 목록</h1>
      <div className="flex gap-2 mb-4">
        {CATEGORIES.map((c) => (
          <span key={c.id} className="px-3 py-1 border rounded text-sm">{c.label}</span>
        ))}
      </div>
      <p className="text-muted-foreground">TODO: 2단계에서 구현 (제목 LIKE 검색 + 카테고리 필터)</p>
    </main>
  )
}
