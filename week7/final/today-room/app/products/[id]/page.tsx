export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">상품 상세</h1>
      <p className="text-sm text-muted-foreground">ID: {params.id}</p>
      <p className="text-muted-foreground mt-4">TODO: 2단계에서 구현 (이미지·정보·구매·채팅·찜)</p>
    </main>
  )
}
