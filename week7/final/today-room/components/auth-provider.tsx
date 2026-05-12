"use client"

import * as React from "react"
import { apiGet, apiPost, getToken, setToken, removeToken } from "@/lib/auth-client"
import type { AuthUser } from "@/types/database.types"

type AuthState = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signup: (email: string, password: string, neighborhood: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = React.createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  const refresh = React.useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const r = await apiGet<{ user?: AuthUser; error?: string }>("/api/auth/me")
    if (r.ok && r.data.user) {
      setUser(r.data.user)
    } else {
      removeToken()
      setUser(null)
    }
    setLoading(false)
  }, [])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  const signup = React.useCallback(async (email: string, password: string, neighborhood: string) => {
    const r = await apiPost<{ user?: AuthUser; token?: string; error?: string }>("/api/auth/register", { email, password, neighborhood })
    if (r.ok && r.data.token && r.data.user) {
      setToken(r.data.token)
      setUser(r.data.user)
      return { ok: true }
    }
    return { ok: false, error: r.data.error || "회원가입 실패" }
  }, [])

  const login = React.useCallback(async (email: string, password: string) => {
    const r = await apiPost<{ user?: AuthUser; token?: string; error?: string }>("/api/auth/login", { email, password })
    if (r.ok && r.data.token && r.data.user) {
      setToken(r.data.token)
      setUser(r.data.user)
      return { ok: true }
    }
    return { ok: false, error: r.data.error || "로그인 실패" }
  }, [])

  const logout = React.useCallback(async () => {
    await apiPost("/api/auth/logout", {}).catch(() => undefined)
    removeToken()
    setUser(null)
  }, [])

  const value = React.useMemo<AuthState>(() => ({ user, loading, login, signup, logout, refresh }), [user, loading, login, signup, logout, refresh])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
