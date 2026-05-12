// GET    /api/favorites                  — 내 찜 목록 (Bearer)
// POST   /api/favorites { product_id }   — 찜 추가
// DELETE /api/favorites?product_id=...   — 찜 해제
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import { verifyTokenWithRevoke } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const r = await getPool().query(
      `SELECT p.id, p.title, p.price, p.category, p.images, p.created_at, f.created_at AS favorited_at
         FROM tr_favorites f
         JOIN tr_products p ON p.id = f.product_id
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC`,
      [auth.uid]
    )
    return NextResponse.json({ favorites: r.rows })
  } catch (e: unknown) {
    console.error("[favorites GET]", e)
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const { product_id } = await req.json()
    if (!product_id || typeof product_id !== "string") {
      return NextResponse.json({ error: "product_id 필수" }, { status: 400 })
    }
    await getPool().query(
      `INSERT INTO tr_favorites (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING`,
      [auth.uid, product_id]
    )
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    console.error("[favorites POST]", e)
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const product_id = req.nextUrl.searchParams.get("product_id")
    if (!product_id) return NextResponse.json({ error: "product_id 필수" }, { status: 400 })

    await getPool().query(
      `DELETE FROM tr_favorites WHERE user_id = $1 AND product_id = $2`,
      [auth.uid, product_id]
    )
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    console.error("[favorites DELETE]", e)
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
