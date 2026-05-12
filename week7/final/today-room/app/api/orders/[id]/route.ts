// GET /api/orders/[id] — 본인 주문 상세 (Bearer)
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import { verifyTokenWithRevoke } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const r = await getPool().query(
      `SELECT o.id, o.buyer_id, o.product_id, o.amount, o.toss_order_id,
              o.payment_key, o.payment_method, o.status, o.paid_at,
              o.created_at, o.updated_at,
              p.title AS product_title, p.images AS product_images
         FROM tr_orders o
         JOIN tr_products p ON p.id = o.product_id
        WHERE o.id = $1`,
      [params.id]
    )
    if (r.rowCount === 0) return NextResponse.json({ error: "주문 없음" }, { status: 404 })
    if (String(r.rows[0].buyer_id) !== String(auth.uid)) {
      return NextResponse.json({ error: "본인 주문 아님" }, { status: 403 })
    }
    return NextResponse.json({ order: r.rows[0] })
  } catch (e: unknown) {
    console.error("[orders/[id] GET]", e)
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
