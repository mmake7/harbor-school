// 클라이언트 측 토큰 관리 + fetch wrapper
// AuthProvider/useAuth는 components/auth-provider.tsx
const TOKEN_KEY = "today_room_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
}

// fetch wrapper — Authorization 자동 첨부
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const headers = new Headers(init.headers)
  if (token) headers.set("Authorization", `Bearer ${token}`)
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  return fetch(input, { ...init, headers })
}

// 편의 JSON helpers
export async function apiPost<T = unknown>(path: string, body: unknown): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await apiFetch(path, { method: "POST", body: JSON.stringify(body) })
  const data = (await res.json().catch(() => ({}))) as T
  return { ok: res.ok, status: res.status, data }
}

export async function apiGet<T = unknown>(path: string): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await apiFetch(path, { method: "GET" })
  const data = (await res.json().catch(() => ({}))) as T
  return { ok: res.ok, status: res.status, data }
}
