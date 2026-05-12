// JWT 인증 헬퍼 (harbor-community/lib/auth-helper.js + auth.js 패턴 이식)
// - signToken / verifyJwt: JWT 발급·검증
// - hashPassword / verifyPassword: bcrypt 해시
// - readBearer: Authorization 헤더에서 토큰 추출
// - hashToken: sessions.token_hash 매칭용 SHA-256
// - verifyTokenWithRevoke: 서명·만료 + tr_auth_sessions.revoked_at 체크
import crypto from "crypto"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getPool } from "@/lib/db"

const BCRYPT_ROUNDS = 10
const JWT_EXPIRES_IN = "7d"

function getSecret(): string {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error("JWT_SECRET 미설정 — openssl rand -hex 64로 생성 후 .env.local에 추가")
  return s
}

export type JwtPayload = {
  uid: string  // tr_profiles.id (uuid)
  email: string
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: JWT_EXPIRES_IN })
}

export function verifyJwt(token: string | null): JwtPayload | null {
  if (!token) return null
  try {
    const decoded = jwt.verify(token, getSecret()) as JwtPayload
    return { uid: decoded.uid, email: decoded.email }
  } catch {
    return null
  }
}

export function readBearer(headers: Headers): string | null {
  const h = headers.get("authorization") || headers.get("Authorization") || ""
  if (!h.startsWith("Bearer ")) return null
  return h.slice(7).trim() || null
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex")
}

// JWT 7d 만료 시각
export function expiresAt7d(): Date {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
}

// 보호된 라우트용: 서명·만료 + revoke 체크. 통과 시 payload 반환, 실패 시 null.
export async function verifyTokenWithRevoke(headers: Headers): Promise<(JwtPayload & { token: string }) | null> {
  const token = readBearer(headers)
  const payload = verifyJwt(token)
  if (!payload || !token) return null
  const pool = getPool()
  const r = await pool.query(
    `SELECT revoked_at FROM tr_auth_sessions WHERE token_hash = $1 LIMIT 1`,
    [hashToken(token)]
  )
  if (r.rows[0] && r.rows[0].revoked_at) return null
  return { ...payload, token }
}

// 비밀번호 검증 규칙 (harbor-community 그대로): 8+ + 영문/숫자/특수 중 2종
export function validatePassword(p: unknown): string | null {
  if (typeof p !== "string") return "비밀번호 필수"
  if (p.length < 8) return "비밀번호 8자 이상"
  if (p.length > 100) return "비밀번호 100자 이내"
  let kinds = 0
  if (/[a-zA-Z]/.test(p)) kinds++
  if (/\d/.test(p)) kinds++
  if (/[^a-zA-Z0-9]/.test(p)) kinds++
  if (kinds < 2) return "비밀번호 영문/숫자/특수문자 중 2종 이상 조합"
  return null
}

export function isEmail(s: unknown): boolean {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 255
}
