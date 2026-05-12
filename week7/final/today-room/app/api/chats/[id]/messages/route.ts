// GET  /api/chats/[id]/messages           — 메시지 전체 (참여자만)
// POST /api/chats/[id]/messages           — 메시지 전송 ({ content })
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import { verifyTokenWithRevoke } from "@/lib/auth"

async function checkParticipant(chatId: string, userId: string): Promise<{ ok: boolean; chat?: { buyer_id: string; seller_id: string } }> {
  const r = await getPool().query(
    `SELECT buyer_id, seller_id FROM tr_chats WHERE id = $1`,
    [chatId]
  )
  if (r.rowCount === 0) return { ok: false }
  const c = r.rows[0]
  if (String(c.buyer_id) !== userId && String(c.seller_id) !== userId) return { ok: false }
  return { ok: true, chat: c }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const c = await checkParticipant(params.id, auth.uid)
    if (!c.ok) return NextResponse.json({ error: "권한 없음" }, { status: 403 })

    const r = await getPool().query(
      `SELECT id, chat_id, sender_id, content, created_at
         FROM tr_messages
        WHERE chat_id = $1
        ORDER BY created_at ASC`,
      [params.id]
    )
    return NextResponse.json({ messages: r.rows })
  } catch (e: unknown) {
    console.error("[messages GET]", e)
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const c = await checkParticipant(params.id, auth.uid)
    if (!c.ok) return NextResponse.json({ error: "권한 없음" }, { status: 403 })

    const { content } = await req.json()
    if (typeof content !== "string" || content.trim().length === 0 || content.length > 2000) {
      return NextResponse.json({ error: "메시지 1~2000자" }, { status: 400 })
    }

    const ins = await getPool().query(
      `INSERT INTO tr_messages (chat_id, sender_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, chat_id, sender_id, content, created_at`,
      [params.id, auth.uid, content.trim()]
    )
    return NextResponse.json({ message: ins.rows[0] }, { status: 201 })
  } catch (e: unknown) {
    console.error("[messages POST]", e)
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
