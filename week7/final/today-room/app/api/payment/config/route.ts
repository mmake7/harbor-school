// GET /api/payment/config
// 클라이언트에서 TossPayments SDK 초기화에 필요한 client key 반환
// 인증 불필요 — public client key
import { NextResponse } from "next/server"

export async function GET() {
  const ck = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || process.env.TOSS_CLIENT_KEY
  if (!ck) {
    return NextResponse.json(
      { error: "TOSS client key 미설정", detail: "NEXT_PUBLIC_TOSS_CLIENT_KEY를 .env.local에 추가" },
      { status: 500 }
    )
  }
  return NextResponse.json({ tossClientKey: ck })
}
