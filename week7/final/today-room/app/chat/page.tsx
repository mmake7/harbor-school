"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useAuth } from "@/components/auth-provider"
import { apiGet } from "@/lib/auth-client"
import { Card, CardContent } from "@/components/ui/card"

type ChatRow = {
  id: string
  product_id: string
  buyer_id: string
  seller_id: string
  product_title: string
  product_images: string[]
  product_price: number
  buyer_email: string
  seller_email: string
  last_message: string | null
  last_at: string | null
}

export default function ChatListPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [chats, setChats] = React.useState<ChatRow[]>([])
  const [dataLoading, setDataLoading] = React.useState(true)

  React.useEffect(() => {
    if (!loading && !user) router.push("/auth/login")
  }, [loading, user, router])

  React.useEffect(() => {
    if (!user) return
    apiGet<{ chats: ChatRow[] }>(`/api/chats`).then((r) => {
      if (r.ok) setChats(r.data.chats || [])
      setDataLoading(false)
    })
  }, [user])

  if (loading || !user) return <main className="container mx-auto p-6"><p className="text-muted-foreground">로딩…</p></main>

  return (
    <main className="container mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">채팅</h1>
      {dataLoading ? (
        <p className="text-muted-foreground">로딩…</p>
      ) : chats.length === 0 ? (
        <p className="text-muted-foreground">참여 중인 채팅방이 없음</p>
      ) : (
        <div className="space-y-2">
          {chats.map((c) => {
            const opponentEmail = String(c.buyer_id) === user.id ? c.seller_email : c.buyer_email
            const role = String(c.buyer_id) === user.id ? "구매자" : "판매자"
            return (
              <Link key={c.id} href={`/chat/${c.id}`}>
                <Card className="hover:bg-accent transition">
                  <CardContent className="p-3 flex gap-3">
                    <div className="relative h-16 w-16 bg-muted rounded shrink-0">
                      {c.product_images[0] && (
                        <Image src={c.product_images[0]} alt="" fill sizes="64px" className="object-cover rounded" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-medium line-clamp-1">{opponentEmail.split("@")[0]}</span>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">{role}</span>
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{c.product_title} · ₩{c.product_price.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1 mt-1">{c.last_message || "— 대화 시작 —"}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
