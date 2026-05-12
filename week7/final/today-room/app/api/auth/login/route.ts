// POST /api/auth/login
// body: { email, password }
// → 200: { user, token }
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import { verifyPassword, signToken, hashToken, expiresAt7d, isEmail } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body || {}

    if (!isEmail(email) || typeof password !== "string") {
      return NextResponse.json({ error: "입력값 오류" }, { status: 400 })
    }

    const pool = getPool()
    const r = await pool.query(
      `SELECT id, email, password_hash, neighborhood, created_at
         FROM tr_profiles
        WHERE lower(email) = lower($1)`,
      [email]
    )
    const user = r.rows[0]
    const GENERIC = "이메일 또는 비밀번호 오류"
    if (!user) return NextResponse.json({ error: GENERIC }, { status: 401 })

    const ok = await verifyPassword(password, user.password_hash)
    if (!ok) return NextResponse.json({ error: GENERIC }, { status: 401 })

    const token = signToken({ uid: user.id, email: user.email })
    await pool.query(
      `INSERT INTO tr_auth_sessions (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, hashToken(token), expiresAt7d()]
    )

    const { password_hash: _, ...publicUser } = user
    void _
    return NextResponse.json({ user: publicUser, token })
  } catch (e: unknown) {
    console.error("[auth/login]", e)
    const msg = e instanceof Error ? e.message : "서버 오류"
    return NextResponse.json({ error: "서버 오류", detail: msg }, { status: 500 })
  }
}
