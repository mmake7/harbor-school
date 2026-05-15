"use client";

import * as React from "react";
import Image from "next/image";
import {
  getChatHistory,
  appendChatMessage,
  clearChatHistory,
  type ChatMessage,
} from "@/lib/chat-store";

function DaoniAvatar() {
  return (
    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface border-[0.5px] border-border">
      <Image
        src="/seed-images/daoni-character.png"
        alt="다오니"
        fill
        sizes="40px"
        className="object-cover"
      />
    </div>
  );
}

const SEED_GREETING: ChatMessage = {
  role: "assistant",
  content:
    "안녕하세요, 저는 다오니예요. 염창동 4층 옥상에서 1인 농장 운영하고 있어요. 농장이나 작물 궁금한 거 있으면 편하게 물어보세요.",
  timestamp: 0,
};

export function DaoniChatUI({ day }: { day: number }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let stored = getChatHistory();
    if (stored.length === 0) {
      appendChatMessage(SEED_GREETING);
      stored = [SEED_GREETING];
    }
    setMessages(stored);
    setMounted(true);
  }, []);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };
    appendChatMessage(userMsg);
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsLoading(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, day }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json?.error ?? `HTTP ${r.status}`);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: json.content,
        timestamp: Date.now(),
      };
      appendChatMessage(assistantMsg);
      setMessages([...next, assistantMsg]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const errMsg: ChatMessage = {
        role: "assistant",
        content: `(잠시 자리를 비웠어요: ${msg.slice(0, 100)})`,
        timestamp: Date.now(),
      };
      setMessages([...next, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    clearChatHistory();
    appendChatMessage(SEED_GREETING);
    setMessages([SEED_GREETING]);
  }

  return (
    <div className="flex flex-col h-[600px] bg-base border-[0.5px] border-border rounded-lg">
      <div className="border-b border-border p-3 flex items-center justify-between">
        <div className="text-sm text-muted">대화</div>
        <button
          onClick={reset}
          className="text-xs text-muted-light hover:text-ink"
        >
          초기화
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!mounted ? (
          <div className="text-xs text-muted">로딩…</div>
        ) : (
          messages.map((m, i) =>
            m.role === "assistant" ? (
              <div key={i} className="flex justify-start gap-2 items-start">
                <DaoniAvatar />
                <div className="bg-ink text-white rounded-lg p-3 max-w-[80%] text-sm flex gap-2">
                  <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="whitespace-pre-line">{m.content}</div>
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <div className="bg-primary-light text-primary-dark rounded-lg p-3 max-w-[80%] text-sm whitespace-pre-line">
                  {m.content}
                </div>
              </div>
            )
          )
        )}
        {isLoading && (
          <div className="flex justify-start gap-2 items-start">
            <DaoniAvatar />
            <div className="bg-ink text-white rounded-lg p-3 text-sm flex items-center gap-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-white/70 text-xs">다온이가 응답 중…</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-border p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="다온이에게 물어보세요"
          disabled={isLoading}
          className="flex-1 border-[0.5px] border-border rounded-md px-3 py-2 text-sm bg-base"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-primary text-white text-sm rounded-md px-4 py-2 hover:bg-primary-dark disabled:opacity-50"
        >
          보내기
        </button>
      </form>
    </div>
  );
}
