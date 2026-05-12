export default function ChatRoomPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">채팅방</h1>
      <p className="text-sm text-muted-foreground">Chat ID: {params.id}</p>
      <p className="text-muted-foreground mt-4">TODO: 2단계에서 구현 (메시지 polling 3~5초)</p>
    </main>
  )
}
