"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function PaymentFailInner() {
  const router = useRouter()
  const sp = useSearchParams()
  const code = sp.get("code")
  const message = sp.get("message")

  return (
    <Card>
      <CardHeader><CardTitle>결제 실패</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {code && <p className="text-sm text-muted-foreground">코드: {code}</p>}
        {message && <p className="text-sm">{message}</p>}
        <div className="flex gap-2">
          <Button onClick={() => router.push("/products")} variant="outline" className="flex-1">상품 둘러보기</Button>
          <Button onClick={() => router.back()} className="flex-1">다시 시도</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PaymentFailPage() {
  return (
    <main className="container mx-auto max-w-xl p-6">
      <Suspense fallback={<p className="text-muted-foreground">로딩…</p>}>
        <PaymentFailInner />
      </Suspense>
    </main>
  )
}
