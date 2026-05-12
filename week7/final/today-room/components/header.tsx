"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"

export function Header() {
  const { user, loading, logout } = useAuth()

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          today-room
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/products" className="px-3 py-1 hover:underline">상품</Link>
          {loading ? (
            <span className="text-muted-foreground px-3">…</span>
          ) : user ? (
            <>
              <Link href="/products/new" className="px-3 py-1 hover:underline">등록</Link>
              <Link href="/chat" className="px-3 py-1 hover:underline">채팅</Link>
              <Link href="/mypage" className="px-3 py-1 hover:underline">{user.email.split("@")[0]}</Link>
              <Button variant="outline" size="sm" onClick={() => void logout()}>로그아웃</Button>
            </>
          ) : (
            <>
              <Link href="/auth/login"><Button variant="ghost" size="sm">로그인</Button></Link>
              <Link href="/auth/signup"><Button size="sm">회원가입</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
