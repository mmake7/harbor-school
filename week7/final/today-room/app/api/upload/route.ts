// POST /api/upload
// Authorization: Bearer <JWT>
// body: { filename, contentType, base64 }
// → 200: { url, fileId, size }
import { NextRequest, NextResponse } from "next/server"
import { verifyTokenWithRevoke } from "@/lib/auth"
import { uploadImage, ALLOWED_TYPES } from "@/lib/upload"

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyTokenWithRevoke(req.headers)
    if (!auth) return NextResponse.json({ error: "인증 필요" }, { status: 401 })

    const body = await req.json()
    const { filename, contentType, base64 } = body || {}

    if (!filename || typeof filename !== "string" || filename.length > 200) {
      return NextResponse.json({ error: "filename 필수" }, { status: 400 })
    }
    if (!contentType || !(ALLOWED_TYPES as readonly string[]).includes(contentType)) {
      return NextResponse.json(
        { error: "contentType 허용 안됨", detail: `허용: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      )
    }
    if (!base64 || typeof base64 !== "string") {
      return NextResponse.json({ error: "base64 필수" }, { status: 400 })
    }

    const result = await uploadImage({ base64, filename, contentType, userId: auth.uid })
    return NextResponse.json(result)
  } catch (e: unknown) {
    console.error("[upload]", e)
    const msg = e instanceof Error ? e.message : "업로드 실패"
    return NextResponse.json({ error: "업로드 실패", detail: msg }, { status: 500 })
  }
}
