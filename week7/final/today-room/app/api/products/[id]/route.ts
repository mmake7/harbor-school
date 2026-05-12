// GET /api/products/[id]  → product + seller 정보
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const r = await getPool().query(
      `SELECT
         p.id, p.user_id, p.title, p.price, p.description, p.category, p.images,
         p.created_at, p.updated_at,
         pr.email AS seller_email,
         pr.neighborhood AS seller_neighborhood
       FROM tr_products p
       LEFT JOIN tr_profiles pr ON pr.id = p.user_id
       WHERE p.id = $1`,
      [params.id]
    )
    if (r.rowCount === 0) return NextResponse.json({ error: "상품 없음" }, { status: 404 })
    return NextResponse.json({ product: r.rows[0] })
  } catch (e: unknown) {
    console.error("[products/[id] GET]", e)
    const msg = e instanceof Error ? e.message : "서버 오류"
    return NextResponse.json({ error: "서버 오류", detail: msg }, { status: 500 })
  }
}
