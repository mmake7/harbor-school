// POST /api/payment/confirm
// Authorization: Bearer <JWT>
// body: { paymentKey, orderId, amount }
// → 200: { ok, order_id, status, payment_method, paid_at }
// (harbor-community/api/payment.js confirmPost 패턴 이식)
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import { verifyTokenWithRevoke } from "@/lib/auth"

const TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm"

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const { paymentKey, orderId, amount } = await req.json()
    if (!paymentKey || typeof paymentKey !== "string") return NextResponse.json({ error: "paymentKey 필수" }, { status: 400 })
    if (!orderId || typeof orderId !== "string") return NextResponse.json({ error: "orderId 필수" }, { status: 400 })
    const amt = Number(amount)
    if (!Number.isInteger(amt) || amt <= 0) return NextResponse.json({ error: "amount 양의 정수" }, { status: 400 })

    const sk = process.env.TOSS_SECRET_KEY
    if (!sk) return NextResponse.json({ error: "TOSS_SECRET_KEY 미설정" }, { status: 500 })

    const pool = getPool()
    const r = await pool.query(
      `SELECT id, buyer_id, amount, status FROM tr_orders WHERE toss_order_id = $1`,
      [orderId]
    )
    if (r.rowCount === 0) return NextResponse.json({ error: "주문 없음" }, { status: 404 })
    const ord = r.rows[0]
    if (String(ord.buyer_id) !== String(auth.uid)) {
      return NextResponse.json({ error: "본인 주문 아님" }, { status: 403 })
    }
    if (ord.status === "paid") {
      return NextResponse.json({ ok: true, order_id: ord.id, status: "paid", already: true })
    }
    if (ord.status !== "pending") {
      return NextResponse.json({ error: `주문 상태 비정상 (${ord.status})` }, { status: 409 })
    }
    if (amt !== ord.amount) {
      return NextResponse.json({ error: "금액 불일치", detail: { expected: ord.amount, got: amt } }, { status: 400 })
    }

    const basicAuth = Buffer.from(sk + ":").toString("base64")
    const tossRes = await fetch(TOSS_CONFIRM_URL, {
      method: "POST",
      headers: { Authorization: `Basic ${basicAuth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ paymentKey, orderId, amount: amt }),
    })
    const tossBody = await tossRes.json().catch(() => ({}))
    if (!tossRes.ok) {
      console.error("[payment/confirm] Toss error", tossRes.status, tossBody)
      return NextResponse.json(
        { error: tossBody.message || "Toss 결제 승인 실패", detail: { code: tossBody.code, raw: tossBody } },
        { status: tossRes.status }
      )
    }

    const method = tossBody.method || null
    const approvedAt = tossBody.approvedAt ? new Date(tossBody.approvedAt) : new Date()
    const updated = await pool.query(
      `UPDATE tr_orders
          SET status = 'paid',
              payment_key = $1,
              payment_method = $2,
              paid_at = $3,
              updated_at = NOW()
        WHERE id = $4 AND status = 'pending'
        RETURNING id, status, payment_method, paid_at`,
      [paymentKey, method, approvedAt, ord.id]
    )
    if (updated.rowCount === 0) {
      const re = await pool.query(`SELECT id, status, payment_method, paid_at FROM tr_orders WHERE id=$1`, [ord.id])
      return NextResponse.json({ ok: true, order_id: ord.id, status: re.rows[0].status, race: true })
    }
    return NextResponse.json({
      ok: true,
      order_id: updated.rows[0].id,
      status: updated.rows[0].status,
      payment_method: updated.rows[0].payment_method,
      paid_at: updated.rows[0].paid_at,
    })
  } catch (e: unknown) {
    console.error("[payment/confirm]", e)
    const msg = e instanceof Error ? e.message : "서버 오류"
    return NextResponse.json({ error: "서버 오류", detail: msg }, { status: 500 })
  }
}
