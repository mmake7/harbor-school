"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"
import { loadTossPayments, type TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk"
import { useAuth } from "@/components/auth-provider"
import { apiGet } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type OrderRow = {
  id: string
  buyer_id: string
  product_id: string
  amount: number
  toss_order_id: string
  status: string
  product_title: string
}

export default function CheckoutPage({ params }: { params: { orderId: string } }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [order, setOrder] = React.useState<OrderRow | null>(null)
  const [clientKey, setClientKey] = React.useState<string>("")
  const [widgets, setWidgets] = React.useState<TossPaymentsWidgets | null>(null)
  const [ready, setReady] = React.useState(false)
  const [paying, setPaying] = React.useState(false)
  const [pageLoading, setPageLoading] = React.useState(true)

  // load order + client key
  React.useEffect(() => {
    if (!user) return
    Promise.all([
      apiGet<{ order?: OrderRow; error?: string }>(`/api/orders/${params.orderId}`),
      apiGet<{ tossClientKey?: string; error?: string }>(`/api/payment/config`),
    ]).then(([o, c]) => {
      if (!o.ok) { toast.error(o.data.error || "주문 조회 실패"); router.push("/"); return }
      if (!c.ok || !c.data.tossClientKey) { toast.error(c.data.error || "결제 설정 조회 실패"); router.push("/"); return }
      setOrder(o.data.order!)
      setClientKey(c.data.tossClientKey)
      setPageLoading(false)
    })
  }, [user, params.orderId, router])

  React.useEffect(() => {
    if (!user) return
    if (!order || !clientKey) return
    if (order.status !== "pending") return

    let cancelled = false
    ;(async () => {
      try {
        const tp = await loadTossPayments(clientKey)
        const customerKey = `customer_${user.id}`
        const w = tp.widgets({ customerKey })
        await w.setAmount({ currency: "KRW", value: order.amount })
        await Promise.all([
          w.renderPaymentMethods({ selector: "#toss-payment-method", variantKey: "DEFAULT" }),
          w.renderAgreement({ selector: "#toss-agreement", variantKey: "AGREEMENT" }),
        ])
        if (!cancelled) {
          setWidgets(w)
          setReady(true)
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "결제 위젯 초기화 실패"
        toast.error(msg)
      }
    })()
    return () => { cancelled = true }
  }, [user, order, clientKey])

  async function onPay() {
    if (!widgets || !order || paying) return
    setPaying(true)
    try {
      await widgets.requestPayment({
        orderId: order.toss_order_id,
        orderName: order.product_title,
        successUrl: window.location.origin + "/payment/success",
        failUrl: window.location.origin + "/payment/fail",
        customerEmail: user?.email,
        customerName: user?.email.split("@")[0],
      })
      // Toss가 successUrl로 redirect — 여기 도달 안 함
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string }
      if (err.code === "USER_CANCEL") toast.info("결제가 취소됐어요")
      else toast.error(err.message || "결제 요청 실패")
      setPaying(false)
    }
  }

  React.useEffect(() => {
    if (!loading && !user) router.push("/auth/login")
  }, [loading, user, router])

  if (loading || pageLoading) return <main className="container mx-auto p-6"><p className="text-muted-foreground">로딩…</p></main>
  if (!order) return null

  if (order.status === "paid") {
    return (
      <main className="container mx-auto max-w-xl p-6">
        <Card><CardContent className="p-8 text-center">이미 결제 완료된 주문입니다.</CardContent></Card>
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-xl p-6 space-y-4">
      <Card>
        <CardHeader><CardTitle>결제</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-muted-foreground">상품</div>
          <div className="font-medium">{order.product_title}</div>
          <div className="text-2xl font-bold mt-2">₩{order.amount.toLocaleString()}</div>
        </CardContent>
      </Card>

      <div id="toss-payment-method" />
      <div id="toss-agreement" />

      <Button className="w-full" onClick={onPay} disabled={!ready || paying}>
        {paying ? "결제 진행…" : ready ? "결제하기" : "위젯 로딩…"}
      </Button>
    </main>
  )
}
