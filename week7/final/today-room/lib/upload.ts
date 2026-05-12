// ImageKit 업로드 헬퍼 (harbor-community/api/upload.js 패턴 이식)
import ImageKit, { toFile } from "@imagekit/nodejs"

export const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"] as const
export const MAX_BYTES = 3 * 1024 * 1024  // 3MB

let _client: ImageKit | null = null

export function getImageKitClient(): ImageKit | null {
  if (_client) return _client
  const priv = process.env.IMAGEKIT_PRIVATE_KEY
  if (!priv) return null
  _client = new ImageKit({ privateKey: priv })
  return _client
}

export type UploadResult = {
  url: string
  fileId: string
  size: number
}

export async function uploadImage(opts: {
  base64: string
  filename: string
  contentType: string
  userId: string
}): Promise<UploadResult> {
  const client = getImageKitClient()
  if (!client) throw new Error("IMAGEKIT_PRIVATE_KEY 미설정")

  const buffer = Buffer.from(opts.base64, "base64")
  if (buffer.length === 0) throw new Error("base64 디코딩 실패")
  if (buffer.length > MAX_BYTES) throw new Error(`파일 크기 초과 (최대 ${MAX_BYTES} bytes)`)

  const ext = (opts.filename.match(/\.(png|jpe?g|webp)$/i) || ["", "png"])[1].toLowerCase().replace("jpg", "jpeg")
  const safeFilename = `u${opts.userId}-${Date.now()}.${ext === "jpeg" ? "jpg" : ext}`

  const result = await client.files.upload({
    file: await toFile(buffer, safeFilename),
    fileName: safeFilename,
    folder: "/today-room/",
    useUniqueFileName: true,
  })

  if (!result.url || !result.fileId) {
    throw new Error("ImageKit 응답에 url/fileId 누락")
  }

  return {
    url: result.url,
    fileId: result.fileId,
    size: buffer.length,
  }
}
