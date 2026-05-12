// Manually maintained types (regenerate via `supabase gen types typescript` if CLI installed)

export type Category = "furniture" | "lighting" | "accessory" | "fabric" | "plant"

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "furniture", label: "가구" },
  { id: "lighting", label: "조명" },
  { id: "accessory", label: "소품" },
  { id: "fabric", label: "패브릭" },
  { id: "plant", label: "식물" },
]

export type Profile = {
  id: string
  email: string | null
  neighborhood: string | null
  created_at: string
}

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

export type Favorite = {
  user_id: string
  product_id: string
  created_at: string
}

export type Chat = {
  id: string
  product_id: string
  buyer_id: string
  seller_id: string
  created_at: string
}

export type Message = {
  id: string
  chat_id: string
  sender_id: string
  content: string
  created_at: string
}
