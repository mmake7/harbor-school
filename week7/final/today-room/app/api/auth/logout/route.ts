// POST /api/auth/logout
// Authorization: Bearer <JWT>
// → 200: { ok: true }  (idempotent — 토큰 무효해도 OK)
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import { readBearer, hashToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const token = readBearer(req.headers)
    if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const pool = getPool()
    await pool.query(
      `UPDATE tr_auth_sessions
          SET revoked_at = NOW()
        WHERE token_hash = $1
          AND revoked_at IS NULL`,
      [hashToken(token)]
    )

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    console.error("[auth/logout]", e)
    const msg = e instanceof Error ? e.message : "서버 오류"
    return NextResponse.json({ error: "서버 오류", detail: msg }, { status: 500 })
  }
}
