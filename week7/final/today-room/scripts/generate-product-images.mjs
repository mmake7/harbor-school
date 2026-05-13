// One-shot seed:
//   - GPT Image 1 (gpt-image-1, medium, 1024x1024) × 5장 — Korean interior product photography
//   - ImageKit /today-room/seed/ 업로드
//   - tr_products: 기존 1개 UPDATE + 4개 INSERT (판매자 = validate-20260513)
//
// 실행: node scripts/generate-product-images.mjs
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"
import ImageKit, { toFile } from "@imagekit/nodejs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const repoRoot = join(root, "..", "..", "..")  // harbor-school

function readEnv(file, key) {
  const txt = readFileSync(file, "utf8")
  const m = txt.match(new RegExp(`^\\s*${key}\\s*=\\s*(\\S+)`, "m"))
  if (!m) throw new Error(`${key} not found in ${file}`)
  return m[1]
}

const DATABASE_URL = readEnv(join(root, ".env.local"), "DATABASE_URL")
const IMAGEKIT_PRIVATE_KEY = readEnv(join(root, ".env.local"), "IMAGEKIT_PRIVATE_KEY")
const OPENAI_API_KEY = readEnv(join(repoRoot, "week7/quest/business-card/.env"), "OPENAI_API_KEY")

const SELLER_EMAIL = "validate-20260513@today-room.test"
const EXISTING_PRODUCT_ID = "16424837-3a59-43a6-a8eb-0f0d437dea1f"  // 기존 검증용 원목 식탁

const PRODUCTS = [
  {
    slot: "P1",
    mode: "update",
    id: EXISTING_PRODUCT_ID,
    title: "원목 6인용 다이닝 테이블",
    description: "솔리드 오크 원목 6인용 식탁. 자연 그대로의 결이 살아 있어요. 의자는 미포함이에요.",
    price: 320000,
    category: "furniture",
    prompt: "Professional product photography of a solid oak wooden dining table for six people, minimalist Korean interior aesthetic, warm beige tones, natural wood grain texture clearly visible, clean off-white background with soft studio lighting, slightly angled top-front view, no people no chairs no other objects, 1024x1024 square composition",
  },
  {
    slot: "P2",
    mode: "insert",
    title: "린넨 갓 펜던트 조명",
    description: "내추럴 린넨 갓 + 브러시드 브라스 디테일. 따뜻한 백열빛으로 분위기 확실해요.",
    price: 89000,
    category: "lighting",
    prompt: "Professional product photography of a single linen-shade pendant lamp hanging vertically, warm beige natural linen fabric shade, brushed brass top detail, lamp turned on with soft warm glow, against clean light gray wall, minimalist Korean interior, soft studio lighting, centered composition, 1024x1024 square",
  },
  {
    slot: "P3",
    mode: "insert",
    title: "세라믹 화병 (중)",
    description: "오프화이트 매트 마감 세라믹 화병. 손으로 빚은 결이 살짝 남아 있어요. 팜파스 한 줄기 어울려요.",
    price: 45000,
    category: "accessory",
    prompt: "Professional product photography of a medium-sized ceramic vase, off-white matte finish, simple cylindrical silhouette with subtle hand-thrown texture, single stem of dried pampas grass inside, sitting on warm oak wood surface, clean light background, soft natural side lighting, minimalist Korean interior aesthetic, 1024x1024 square",
  },
  {
    slot: "P4",
    mode: "insert",
    title: "워시드 린넨 쿠션 커버",
    description: "내추럴 오트밀 베이지 톤. 워싱 처리로 결이 부드럽고 자연스러운 구김이 매력이에요. 50×50.",
    price: 28000,
    category: "fabric",
    prompt: "Professional product photography of a washed linen cushion in natural oatmeal beige color, slightly wrinkled lived-in texture visible, placed at slight angle on warm oak wood surface, soft natural diffused lighting from side, clean minimalist Korean interior aesthetic, no other items, 1024x1024 square",
  },
  {
    slot: "P5",
    mode: "insert",
    title: "몬스테라 델리시오사 (대)",
    description: "건강한 큰 잎 7장. 베이지 테라코타 화분 포함. 직접 픽업만 가능해요 (2인 운반 권장).",
    price: 65000,
    category: "plant",
    prompt: "Professional product photography of a large monstera deliciosa houseplant with healthy fresh green split leaves, planted in a beige terracotta pot, against clean white minimalist Korean interior wall with subtle warm wood floor accent, natural diffused side lighting, centered, 1024x1024 square",
  },
]

const ik = new ImageKit({ privateKey: IMAGEKIT_PRIVATE_KEY })

async function genImage(prompt) {
  const t0 = Date.now()
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1024", quality: "medium", n: 1 }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${JSON.stringify(json).slice(0, 300)}`)
  const buf = Buffer.from(json.data[0].b64_json, "base64")
  return { buf, ms: Date.now() - t0 }
}

async function uploadImage(buf, slot) {
  const filename = `seed-${slot}-${Date.now()}.png`
  const t0 = Date.now()
  const r = await ik.files.upload({
    file: await toFile(buf, filename),
    fileName: filename,
    folder: "/today-room/seed/",
    useUniqueFileName: true,
  })
  return { url: r.url, fileId: r.fileId, ms: Date.now() - t0 }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const client = new pg.Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
await client.connect()
console.log("[db] connected")

const seller = await client.query(`SELECT id FROM tr_profiles WHERE email = $1`, [SELLER_EMAIL])
if (seller.rowCount === 0) {
  await client.end()
  throw new Error(`Seller not found: ${SELLER_EMAIL}`)
}
const sellerId = seller.rows[0].id
console.log("[db] seller_id:", sellerId)

const summary = []
for (const p of PRODUCTS) {
  console.log(`\n[${p.slot}] ${p.title} — generating image…`)
  const { buf, ms: genMs } = await genImage(p.prompt)
  console.log(`[${p.slot}] generated ${(buf.length / 1024).toFixed(0)}KB in ${genMs}ms`)

  const { url, ms: upMs } = await uploadImage(buf, p.slot)
  console.log(`[${p.slot}] uploaded in ${upMs}ms → ${url}`)

  if (p.mode === "update") {
    const r = await client.query(
      `UPDATE tr_products
          SET title=$1, description=$2, price=$3, category=$4, images=$5, updated_at=now()
        WHERE id=$6
        RETURNING id`,
      [p.title, p.description, p.price, p.category, [url], p.id]
    )
    console.log(`[${p.slot}] UPDATE rowCount=${r.rowCount}`)
    summary.push({ slot: p.slot, mode: "update", id: p.id, title: p.title, url })
  } else {
    const r = await client.query(
      `INSERT INTO tr_products (user_id, title, price, description, category, images)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [sellerId, p.title, p.price, p.description, p.category, [url]]
    )
    const newId = r.rows[0].id
    console.log(`[${p.slot}] INSERT id=${newId}`)
    summary.push({ slot: p.slot, mode: "insert", id: newId, title: p.title, url })
  }

  await sleep(1500)
}

await client.end()

console.log("\n=== SUMMARY ===")
for (const s of summary) {
  console.log(`${s.slot} [${s.mode}] ${s.title}\n  id:  ${s.id}\n  img: ${s.url}`)
}
console.log("\nDone.")
