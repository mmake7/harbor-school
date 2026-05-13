// Verify IMAGEKIT_PRIVATE_KEY by pinging ImageKit account endpoint.
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(join(__dirname, "..", ".env.local"), "utf8")
const m = env.match(/IMAGEKIT_PRIVATE_KEY\s*=\s*(\S+)/)
if (!m) throw new Error("IMAGEKIT_PRIVATE_KEY not found")
const key = m[1]

console.log("key prefix:", key.slice(0, 12) + "...")
console.log("key length:", key.length)

// ImageKit auth: Basic <base64(privateKey:)>
const auth = Buffer.from(key + ":").toString("base64")
const res = await fetch("https://api.imagekit.io/v1/files?limit=1", {
  headers: { Authorization: "Basic " + auth },
})
console.log("status:", res.status)
console.log("body:", (await res.text()).slice(0, 500))
