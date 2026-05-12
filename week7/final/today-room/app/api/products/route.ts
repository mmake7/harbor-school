// GET  /api/products?category=&q=&limit=20&offset=0   목록
// POST /api/products                                   등록 (Bearer)
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import { verifyTokenWithRevoke } from "@/lib/auth"
import type { Category } from "@/types/database.types"

const ALLOWED_CATEGORIES: Category[] = ["furniture", "lighting", "accessory", "fabric", "plant"]

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const category = sp.get("category")
    const q = (sp.get("q") || "").trim()
    const limit = Math.min(Math.max(Number(sp.get("limit")) || 20, 1), 100)
    const offset = Math.max(Number(sp.get("offset")) || 0, 0)

    const where: string[] = []
    const params: unknown[] = []

    if (category && ALLOWED_CATEGORIES.includes(category as Category)) {
      params.push(category)
      where.push(`category = $${params.length}`)
    }
    if (q) {
      params.push(`%${q}%`)
      where.push(`title ILIKE $${params.length}`)
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : ""

    params.push(limit)
    params.push(offset)
    const r = await getPool().query(
      `SELECT id, user_id, title, price, description, category, images, created_at, updated_at
         FROM tr_products
         ${whereSql}
        ORDER BY created_at DESC
        LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    )

    return NextResponse.json({ products: r.rows, limit, offset })
  } catch (e: unknown) {
    console.error("[products GET]", e)
    const msg = e instanceof Error ? e.message : "서버 오류"
    return NextResponse.json({ error: "서버 오류", detail: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const body = await req.json()
    const { title, price, description, category, images } = body || {}

    if (typeof title !== "string" || title.trim().length === 0 || title.length > 200) {
      return NextResponse.json({ error: "title 1~200자" }, { status: 400 })
    }
    const p = Number(price)
    if (!Number.isInteger(p) || p < 0 || p > 100_000_000) {
      return NextResponse.json({ error: "price 0 이상 정수" }, { status: 400 })
    }
    if (!ALLOWED_CATEGORIES.includes(category as Category)) {
      return NextResponse.json({ error: "category 잘못됨" }, { status: 400 })
    }
    if (!Array.isArray(images) || images.length > 3 || !images.every((u) => typeof u === "string")) {
      return NextResponse.json({ error: "images 0~3개 URL 배열" }, { status: 400 })
    }
    if (description != null && (typeof description !== "string" || description.length > 5000)) {
      return NextResponse.json({ error: "description 5000자 이내" }, { status: 400 })
    }

    const ins = await getPool().query(
      `INSERT INTO tr_products (user_id, title, price, description, category, images)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, title, price, description, category, images, created_at, updated_at`,
      [auth.uid, title.trim(), p, description || null, category, images]
    )
    return NextResponse.json({ product: ins.rows[0] }, { status: 201 })
  } catch (e: unknown) {
    console.error("[products POST]", e)
    const msg = e instanceof Error ? e.message : "서버 오류"
    return NextResponse.json({ error: "서버 오류", detail: msg }, { status: 500 })
  }
}
