// JWT-based route protection
// Supabase ssr 제거 — Bearer 토큰은 localStorage에서 클라이언트가 fetch에 박는 패턴.
// 서버 측 미들웨어는 보호 라우트의 HTML 진입만 차단. 실제 API 권한은 각 route.ts에서 verifyTokenWithRevoke로.
import { NextResponse, type NextRequest } from "next/server"

const PROTECTED_PATHS = ["/mypage", "/products/new", "/chat"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
  if (!isProtected) return NextResponse.next()

  // localStorage 토큰은 미들웨어에서 못 읽음 (브라우저만 접근). 클라이언트 RootLayout에서
  // useEffect로 토큰 없으면 /auth/login 리다이렉트 처리.
  // 미들웨어는 추가 보호 layer (예: 쿠키 동기화 시) — 현재는 통과만.
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
