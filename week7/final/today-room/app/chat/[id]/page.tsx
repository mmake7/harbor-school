"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import { useAuth } from "@/components/auth-provider"
import { apiGet, apiPost } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import type { Message } from "@/types/database.types"

const POLL_MS = 3000

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [messages, setMessages] = React.useState<Message[]>([])
  const [content, setContent] = React.useState("")
  const [sending, setSending] = React.useState(false)
  const endRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!loading && !user) router.push("/auth/login")
  }, [loading, user, router])

  const fetchMessages = React.useCallback(async () => {
    const r = await apiGet<{ messages?: Message[]; error?: string }>(`/api/chats/${params.id}/messages`)
    if (r.ok && r.data.messages) {
      setMessages((prev) => {
        // 새 메시지만 들어왔을 때 깜빡임 방지 — 같은 길이·마지막 id면 그대로
        if (prev.length === r.data.messages!.length && prev[prev.length - 1]?.id === r.data.messages![r.data.messages!.length - 1]?.id) return prev
        return r.data.messages!
      })
    } else if (r.status === 403 || r.status === 401) {
      toast.error(r.data.error || "권한 없음")
      router.push("/chat")
    }
  }, [params.id, router])

  React.useEffect(() => {
    if (!user) return
    void fetchMessages()
    const t = setInterval(fetchMessages, POLL_MS)
    return () => clearInterval(t)
  }, [user, fetchMessages])

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const text = content.trim()
    if (!text || sending) return
    setSending(true)
    const r = await apiPost<{ message?: Message; error?: string }>(`/api/chats/${params.id}/messages`, { content: text })
    setSending(false)
    if (r.ok && r.data.message) {
      setMessages((prev) => [...prev, r.data.message!])
      setContent("")
    } else {
      toast.error(r.data.error || "전송 실패")
    }
  }

  if (loading || !user) return <main className="container mx-auto p-6"><p className="text-muted-foreground">로딩…</p></main>

  return (
    <main className="container mx-auto max-w-2xl p-6 flex flex-col h-[calc(100vh-3.5rem)]">
      <h1 className="text-lg font-bold mb-3">채팅방</h1>

      <div className="flex-1 overflow-y-auto space-y-2 border rounded p-3 bg-muted/30">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">대화를 시작해보세요</p>
        ) : (
          messages.map((m) => {
            const mine = String(m.sender_id) === user.id
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-background border"}`}>
                  <div className="whitespace-pre-wrap break-words">{m.content}</div>
                  <div className={`text-[10px] mt-1 ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {new Date(m.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="flex gap-2 mt-3">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="메시지 입력"
          disabled={sending}
          maxLength={2000}
        />
        <Button type="submit" disabled={sending || !content.trim()}>전송</Button>
      </form>
    </main>
  )
}
