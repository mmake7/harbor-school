"use client"

import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { apiPost } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type ConfirmResp = {
  ok?: boolean
  order_id?: string
  status?: string
  payment_method?: string | null
  paid_at?: string | null
  error?: string
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const paymentKey = sp.get("paymentKey")
  const orderId = sp.get("orderId")
  const amountStr = sp.get("amount")

  const [state, setState] = React.useState<"confirming" | "ok" | "fail">("confirming")
  const [result, setResult] = React.useState<ConfirmResp | null>(null)

  React.useEffect(() => {
    if (!paymentKey || !orderId || !amountStr) {
      setState("fail")
      setResult({ error: "콜백 파라미터 누락" })
      return
    }
    apiPost<ConfirmResp>("/api/payment/confirm", {
      paymentKey,
      orderId,
      amount: Number(amountStr),
    }).then((r) => {
      if (r.ok && r.data.ok) {
        setState("ok")
        setResult(r.data)
      } else {
        setState("fail")
        setResult(r.data)
      }
    })
  }, [paymentKey, orderId, amountStr])

  return (
    <main className="container mx-auto max-w-xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {state === "confirming" ? "결제 승인 중…"
              : state === "ok" ? "✅ 결제 완료"
              : "결제 승인 실패"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {state === "ok" && (
            <div className="text-sm space-y-1">
              <p>주문 ID: {result?.order_id}</p>
              <p>결제 수단: {result?.payment_method || "—"}</p>
              <p>승인 시각: {result?.paid_at ? new Date(result.paid_at).toLocaleString("ko-KR") : "—"}</p>
            </div>
          )}
          {state === "fail" && (
            <p className="text-sm text-red-600">{result?.error || "알 수 없는 오류"}</p>
          )}
          <div className="flex gap-2">
            <Button onClick={() => router.push("/products")} variant="outline" className="flex-1">상품 둘러보기</Button>
            <Button onClick={() => router.push("/mypage")} className="flex-1">마이페이지</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
