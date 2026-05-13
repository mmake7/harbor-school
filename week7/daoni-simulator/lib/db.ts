// Day 2+ pg 설치 후 활성화
// 패턴: today-room/lib/db.ts (pg Pool 싱글톤, HMR 안전, SSL rejectUnauthorized:false, max:5)
//
// import { Pool } from "pg";
//
// declare global {
//   // eslint-disable-next-line no-var
//   var _pgPool: Pool | undefined;
// }
//
// export function getPool(): Pool {
//   if (!global._pgPool) {
//     if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL 미설정");
//     global._pgPool = new Pool({
//       connectionString: process.env.DATABASE_URL,
//       ssl: { rejectUnauthorized: false },
//       max: 5,
//     });
//   }
//   return global._pgPool;
// }

export async function query<T = unknown>(
  _text: string,
  _params?: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  throw new Error("Day 2+ pg 설치 후 활성화");
}
