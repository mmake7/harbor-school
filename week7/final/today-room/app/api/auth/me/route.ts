// GET /api/auth/me
// Authorization: Bearer <JWT>
// → 200: { user }
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import { verifyTokenWithRevoke } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const pool = getPool()
    const r = await pool.query(
      `SELECT id, email, neighborhood, created_at
         FROM tr_profiles
        WHERE id = $1`,
      [auth.uid]
    )
    if (!r.rows[0]) return NextResponse.json({ error: "사용자 없음" }, { status: 401 })

    return NextResponse.json({ user: r.rows[0] })
  } catch (e: unknown) {
    console.error("[auth/me]", e)
    const msg = e instanceof Error ? e.message : "서버 오류"
    return NextResponse.json({ error: "서버 오류", detail: msg }, { status: 500 })
  }
}
