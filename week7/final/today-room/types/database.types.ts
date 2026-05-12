// 자체 JWT 인증 + 직접 pg 연결 (Supabase Auth/RLS 미사용)
// 모든 DB 테이블 tr_ prefix

export type Category = "furniture" | "lighting" | "accessory" | "fabric" | "plant"

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "furniture", label: "가구" },
  { id: "lighting", label: "조명" },
  { id: "accessory", label: "소품" },
  { id: "fabric", label: "패브릭" },
  { id: "plant", label: "식물" },
]

// table: tr_profiles
export type Profile = {
  id: string
  email: string
  neighborhood: string | null
  created_at: string
}

// 서버 내부용 (password_hash 포함). 클라이언트엔 절대 노출 X
export type ProfileWithHash = Profile & { password_hash: string }

// table: tr_auth_sessions
export type AuthSession = {
  id: string
  user_id: string
  token_hash: string
  expires_at: string
  revoked_at: string | null
  created_at: string
}

// table: tr_products
export type Product = {
  id: string
  user_id: string
  title: string
  price: number
  description: string | null
  category: Category
  images: string[]  // ImageKit URL 0~3개
  created_at: string
  updated_at: string
}

// table: tr_favorites
export type Favorite = {
  user_id: string
  product_id: string
  created_at: string
}

// table: tr_chats
export type Chat = {
  id: string
  product_id: string
  buyer_id: string
  seller_id: string
  created_at: string
}

// table: tr_messages
export type Message = {
  id: string
  chat_id: string
  sender_id: string
  content: string
  created_at: string
}

// table: tr_orders
export type OrderStatus = "pending" | "paid" | "canceled" | "failed"
export type Order = {
  id: string
  buyer_id: string
  product_id: string
  amount: number
  toss_order_id: string
  payment_key: string | null
  payment_method: string | null
  status: OrderStatus
  paid_at: string | null
  created_at: string
  updated_at: string
}

// 로그인 응답 user 객체
export type AuthUser = Profile
export type AuthResponse = { user: AuthUser; token: string }
