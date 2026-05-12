// POST /api/auth/register
// body: { email, password, neighborhood? }
// → 201: { user, token }
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import {
  hashPassword,
  signToken,
  hashToken,
  expiresAt7d,
  validatePassword,
  isEmail,
} from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, neighborhood } = body || {}

    if (!isEmail(email)) return NextResponse.json({ error: "email 형식 오류" }, { status: 400 })
    const pwErr = validatePassword(password)
    if (pwErr) return NextResponse.json({ error: pwErr }, { status: 400 })

    const pool = getPool()
    const dup = await pool.query(
      `SELECT 1 FROM tr_profiles WHERE lower(email) = lower($1)`,
      [email]
    )
    if (dup.rowCount && dup.rowCount > 0) {
      return NextResponse.json({ error: "이미 가입된 이메일" }, { status: 409 })
    }

    const hash = await hashPassword(password)
    const ins = await pool.query(
      `INSERT INTO tr_profiles (email, password_hash, neighborhood)
       VALUES ($1, $2, $3)
       RETURNING id, email, neighborhood, created_at`,
      [email, hash, neighborhood || null]
    )
    const user = ins.rows[0]

    const token = signToken({ uid: user.id, email: user.email })
    await pool.query(
      `INSERT INTO tr_auth_sessions (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, hashToken(token), expiresAt7d()]
    )

    return NextResponse.json({ user, token }, { status: 201 })
  } catch (e: unknown) {
    console.error("[auth/register]", e)
    const msg = e instanceof Error ? e.message : "서버 오류"
    return NextResponse.json({ error: "서버 오류", detail: msg }, { status: 500 })
  }
}
