// Manually maintained types
// 모든 DB 테이블은 tr_ prefix (today-room 식별, 기존 Supabase 프로젝트 재활용)

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
  email: string | null
  neighborhood: string | null
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
  images: string[]
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

// Storage bucket: tr-product-images (public)
export const STORAGE_BUCKET = "tr-product-images"
