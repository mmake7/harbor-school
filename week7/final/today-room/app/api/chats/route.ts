// GET  /api/chats                   — 내 채팅방 목록 (buyer or seller)
// POST /api/chats { product_id }    — 채팅방 생성 또는 기존 반환
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import { verifyTokenWithRevoke } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const r = await getPool().query(
      `SELECT
         c.id, c.product_id, c.buyer_id, c.seller_id, c.created_at,
         p.title AS product_title, p.images AS product_images, p.price AS product_price,
         buyer.email AS buyer_email,
         seller.email AS seller_email,
         (SELECT content FROM tr_messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
         (SELECT created_at FROM tr_messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_at
       FROM tr_chats c
       JOIN tr_products p ON p.id = c.product_id
       JOIN tr_profiles buyer ON buyer.id = c.buyer_id
       JOIN tr_profiles seller ON seller.id = c.seller_id
       WHERE c.buyer_id = $1 OR c.seller_id = $1
       ORDER BY COALESCE(
         (SELECT created_at FROM tr_messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1),
         c.created_at
       ) DESC`,
      [auth.uid]
    )
    return NextResponse.json({ chats: r.rows })
  } catch (e: unknown) {
    console.error("[chats GET]", e)
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const { product_id } = await req.json()
    if (!product_id) return NextResponse.json({ error: "product_id 필수" }, { status: 400 })

    const pool = getPool()
    const p = await pool.query(`SELECT id, user_id FROM tr_products WHERE id = $1`, [product_id])
    if (p.rowCount === 0) return NextResponse.json({ error: "상품 없음" }, { status: 404 })
    const seller_id = p.rows[0].user_id
    if (String(seller_id) === String(auth.uid)) {
      return NextResponse.json({ error: "본인 상품엔 채팅 불가" }, { status: 400 })
    }

    const ins = await pool.query(
      `INSERT INTO tr_chats (product_id, buyer_id, seller_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (product_id, buyer_id) DO UPDATE SET product_id = EXCLUDED.product_id
       RETURNING id, product_id, buyer_id, seller_id, created_at`,
      [product_id, auth.uid, seller_id]
    )
    return NextResponse.json({ chat: ins.rows[0] }, { status: 201 })
  } catch (e: unknown) {
    console.error("[chats POST]", e)
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
