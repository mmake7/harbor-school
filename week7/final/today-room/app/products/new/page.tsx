"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { useAuth } from "@/components/auth-provider"
import { apiPost } from "@/lib/auth-client"
import { CATEGORIES, type Category, type Product } from "@/types/database.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const schema = z.object({
  title: z.string().min(1, "제목 필수").max(200),
  price: z.number().int().min(0).max(100_000_000),
  category: z.enum(["furniture", "lighting", "accessory", "fabric", "plant"]),
  description: z.string().max(5000).optional(),
})
type FormValues = z.infer<typeof schema>

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"]
const MAX_IMAGES = 3

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => {
      const r = String(fr.result || "")
      const i = r.indexOf("base64,")
      resolve(i >= 0 ? r.slice(i + 7) : r)
    }
    fr.onerror = () => reject(new Error("파일 읽기 실패"))
    fr.readAsDataURL(file)
  })
}

export default function NewProductPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [images, setImages] = React.useState<string[]>([])
  const [uploading, setUploading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", price: 0, category: "furniture", description: "" },
  })

  React.useEffect(() => {
    if (!loading && !user) {
      toast.error("로그인 필요")
      router.push("/auth/login")
    }
  }, [loading, user, router])

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`이미지 최대 ${MAX_IMAGES}장`)
      return
    }
    setUploading(true)
    try {
      for (const f of files) {
        if (!ALLOWED_TYPES.includes(f.type)) {
          toast.error(`형식 ${f.type} 미지원`)
          continue
        }
        if (f.size > 3 * 1024 * 1024) {
          toast.error(`${f.name} 3MB 초과`)
          continue
        }
        const b64 = await fileToBase64(f)
        const r = await apiPost<{ url?: string; error?: string }>("/api/upload", {
          filename: f.name,
          contentType: f.type,
          base64: b64,
        })
        if (r.ok && r.data.url) {
          setImages((prev) => [...prev, r.data.url!])
        } else {
          toast.error(r.data.error || "업로드 실패")
        }
      }
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, k) => k !== i))
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const r = await apiPost<{ product?: Product; error?: string }>("/api/products", {
      ...values,
      description: values.description || null,
      images,
    })
    setSubmitting(false)
    if (r.ok && r.data.product) {
      toast.success("등록 완료")
      router.push(`/products/${r.data.product.id}`)
    } else {
      toast.error(r.data.error || "등록 실패")
    }
  }

  if (loading || !user) {
    return <main className="container mx-auto p-6"><p className="text-muted-foreground">로딩…</p></main>
  }

  return (
    <main className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader><CardTitle>상품 등록</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목</FormLabel>
                    <FormControl><Input {...field} placeholder="예: 원목 식탁" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>가격 (원)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as Category}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명 (선택)</FormLabel>
                    <FormControl><Textarea rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>이미지 (최대 {MAX_IMAGES}장, 각 3MB)</FormLabel>
                <Input
                  type="file"
                  accept={ALLOWED_TYPES.join(",")}
                  multiple
                  onChange={onFileChange}
                  disabled={uploading || images.length >= MAX_IMAGES}
                />
                {uploading && <p className="text-sm text-muted-foreground">업로드 중…</p>}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {images.map((url, i) => (
                      <div key={url} className="relative aspect-square rounded border overflow-hidden">
                        <Image src={url} alt={`upload-${i}`} fill sizes="150px" className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded px-1"
                        >제거</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={submitting || uploading}>
                {submitting ? "등록 중…" : "등록"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
