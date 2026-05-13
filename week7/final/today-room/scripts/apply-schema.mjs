// One-shot schema applier — reads .env.local DATABASE_URL, runs supabase/schema.sql.
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

const env = readFileSync(join(root, ".env.local"), "utf8")
const m = env.match(/DATABASE_URL\s*=\s*(\S+)/)
if (!m) throw new Error("DATABASE_URL not found in .env.local")
const DATABASE_URL = m[1]

const sql = readFileSync(join(root, "supabase", "schema.sql"), "utf8")

const client = new pg.Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
await client.connect()
console.log("connected")
await client.query(sql)
console.log("schema applied")
const tables = await client.query(`SELECT tablename FROM pg_tables WHERE tablename LIKE 'tr_%' ORDER BY tablename`)
console.log("tr_* tables:", tables.rows.map(r => r.tablename).join(", "))
await client.end()
