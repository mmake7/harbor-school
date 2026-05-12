// PostgreSQL Pool singleton (Next.js 14 HMR-safe)
// Pattern: harbor-community/api/auth.js 그대로 + global cache로 HMR 대응
import { Pool } from "pg"

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined
}

export function getPool(): Pool {
  if (!global._pgPool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL 미설정 — .env.local 확인")
    }
    global._pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    })
  }
  return global._pgPool
}

// 자주 쓰는 단축
export async function query<T = unknown>(text: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number | null }> {
  const pool = getPool()
  const r = await pool.query(text, params as never)
  return { rows: r.rows as T[], rowCount: r.rowCount }
}
