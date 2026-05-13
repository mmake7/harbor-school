// 다오니 챗 — 클라 전용 localStorage 헬퍼 (Claude SDK 의존성 없음)
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

const KEY = "daoni-chat-history";

export function getChatHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

export function appendChatMessage(message: ChatMessage): void {
  if (typeof window === "undefined") return;
  try {
    const all = getChatHistory();
    all.push(message);
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function clearChatHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
