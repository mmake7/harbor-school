// GET    /api/products/[id]   → product + seller 정보
// PATCH  /api/products/[id]   → 본인 상품 수정 (Bearer)
// DELETE /api/products/[id]   → 본인 상품 삭제 (Bearer)
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import { verifyTokenWithRevoke } from "@/lib/auth"
import type { Category } from "@/types/database.types"

const ALLOWED_CATEGORIES: Category[] = ["furniture", "lighting", "accessory", "fabric", "plant"]

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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const pool = getPool()
    const own = await pool.query(`SELECT user_id FROM tr_products WHERE id = $1`, [params.id])
    if (own.rowCount === 0) return NextResponse.json({ error: "상품 없음" }, { status: 404 })
    if (String(own.rows[0].user_id) !== String(auth.uid)) {
      return NextResponse.json({ error: "본인 상품 아님" }, { status: 403 })
    }

    const body = await req.json()
    const sets: string[] = []
    const args: unknown[] = []

    if (typeof body.title === "string") {
      if (body.title.trim().length === 0 || body.title.length > 200) {
        return NextResponse.json({ error: "title 1~200자" }, { status: 400 })
      }
      args.push(body.title.trim()); sets.push(`title = $${args.length}`)
    }
    if (body.price !== undefined) {
      const p = Number(body.price)
      if (!Number.isInteger(p) || p < 0 || p > 100_000_000) {
        return NextResponse.json({ error: "price 0 이상 정수" }, { status: 400 })
      }
      args.push(p); sets.push(`price = $${args.length}`)
    }
    if (body.category !== undefined) {
      if (!ALLOWED_CATEGORIES.includes(body.category)) {
        return NextResponse.json({ error: "category 잘못됨" }, { status: 400 })
      }
      args.push(body.category); sets.push(`category = $${args.length}`)
    }
    if (body.description !== undefined) {
      if (body.description !== null && (typeof body.description !== "string" || body.description.length > 5000)) {
        return NextResponse.json({ error: "description 5000자 이내" }, { status: 400 })
      }
      args.push(body.description); sets.push(`description = $${args.length}`)
    }
    if (body.images !== undefined) {
      if (!Array.isArray(body.images) || body.images.length > 3 || !body.images.every((u: unknown) => typeof u === "string")) {
        return NextResponse.json({ error: "images 0~3개 URL 배열" }, { status: 400 })
      }
      args.push(body.images); sets.push(`images = $${args.length}`)
    }

    if (sets.length === 0) return NextResponse.json({ error: "변경 사항 없음" }, { status: 400 })

    args.push(params.id)
    const upd = await pool.query(
      `UPDATE tr_products
          SET ${sets.join(", ")}, updated_at = NOW()
        WHERE id = $${args.length}
        RETURNING id, user_id, title, price, description, category, images, created_at, updated_at`,
      args
    )
    return NextResponse.json({ product: upd.rows[0] })
  } catch (e: unknown) {
    console.error("[products/[id] PATCH]", e)
    const msg = e instanceof Error ? e.message : "서버 오류"
    return NextResponse.json({ error: "서버 오류", detail: msg }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const pool = getPool()
    const own = await pool.query(`SELECT user_id FROM tr_products WHERE id = $1`, [params.id])
    if (own.rowCount === 0) return NextResponse.json({ error: "상품 없음" }, { status: 404 })
    if (String(own.rows[0].user_id) !== String(auth.uid)) {
      return NextResponse.json({ error: "본인 상품 아님" }, { status: 403 })
    }

    await pool.query(`DELETE FROM tr_products WHERE id = $1`, [params.id])
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    console.error("[products/[id] DELETE]", e)
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
