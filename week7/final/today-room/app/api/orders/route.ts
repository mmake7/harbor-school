// POST /api/orders { product_id }
// → 201: { order: { id, toss_order_id, amount, product_title } }
// 흐름: 상품 조회 → 본인 상품 X · amount > 0 검증 → tr_orders pending insert
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import { verifyTokenWithRevoke } from "@/lib/auth"

function genTossOrderId() {
  // 6자 이상 64자 이내 (Toss 규칙)
  return `tr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const { product_id } = await req.json()
    if (!product_id) return NextResponse.json({ error: "product_id 필수" }, { status: 400 })

    const pool = getPool()
    const p = await pool.query(
      `SELECT id, user_id, title, price FROM tr_products WHERE id = $1`,
      [product_id]
    )
    if (p.rowCount === 0) return NextResponse.json({ error: "상품 없음" }, { status: 404 })
    const prod = p.rows[0]
    if (String(prod.user_id) === String(auth.uid)) {
      return NextResponse.json({ error: "본인 상품 구매 불가" }, { status: 400 })
    }
    if (prod.price <= 0) return NextResponse.json({ error: "결제 가능 금액 아님" }, { status: 400 })

    const tossOrderId = genTossOrderId()
    const ins = await pool.query(
      `INSERT INTO tr_orders (buyer_id, product_id, amount, toss_order_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, buyer_id, product_id, amount, toss_order_id, status, created_at`,
      [auth.uid, product_id, prod.price, tossOrderId]
    )
    return NextResponse.json({
      order: { ...ins.rows[0], product_title: prod.title },
    }, { status: 201 })
  } catch (e: unknown) {
    console.error("[orders POST]", e)
    const msg = e instanceof Error ? e.message : "서버 오류"
    return NextResponse.json({ error: "서버 오류", detail: msg }, { status: 500 })
  }
}
