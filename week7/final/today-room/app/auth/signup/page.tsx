"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const schema = z.object({
  email: z.string().email("이메일 형식 확인"),
  password: z.string()
    .min(8, "비밀번호 8자 이상")
    .max(100, "비밀번호 100자 이내")
    .refine((p) => {
      let k = 0
      if (/[a-zA-Z]/.test(p)) k++
      if (/\d/.test(p)) k++
      if (/[^a-zA-Z0-9]/.test(p)) k++
      return k >= 2
    }, "영문/숫자/특수 중 2종 이상"),
  neighborhood: z.string().min(2, "동네 2자 이상").max(50),
})

type FormValues = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [submitting, setSubmitting] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", neighborhood: "" },
  })

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const r = await signup(values.email, values.password, values.neighborhood)
    setSubmitting(false)
    if (r.ok) {
      toast.success("회원가입 완료")
      router.push("/")
    } else {
      toast.error(r.error || "회원가입 실패")
    }
  }

  return (
    <main className="container mx-auto max-w-md p-6">
      <Card>
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="8자 이상, 영문/숫자/특수 2종" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>동네</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 마조로, 염창동" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "가입 중…" : "회원가입"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                이미 계정 있음? <Link href="/auth/login" className="underline">로그인</Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
