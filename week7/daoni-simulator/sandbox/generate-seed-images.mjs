// Day 3 단계 5 sandbox — 시드 이미지 4장 사전 생성
// 실행: node sandbox/generate-seed-images.mjs
// 결과: public/seed-images/{strawberry,blueberry,melon,sprout}.png
// 비용: gpt-image-2 medium 1024x1024 × 4 = ~$0.16
import OpenAI from "openai";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// .env.local에서 OPENAI_API_KEY 읽기
const envText = readFileSync(join(root, ".env.local"), "utf8");
const m = envText.match(/^\s*OPENAI_API_KEY\s*=\s*["']?([^"'\s]+)["']?/m);
if (!m) {
  console.error("OPENAI_API_KEY not found in .env.local");
  process.exit(1);
}
const apiKey = m[1];
const client = new OpenAI({ apiKey });

const outDir = join(root, "public", "seed-images");
mkdirSync(outDir, { recursive: true });

const PROMPTS = {
  strawberry:
    "Fresh ripe strawberries on rooftop urban farm, clean modern photography, soft natural light, minimal composition, square 1:1",
  blueberry:
    "Fresh blueberries on white surface, urban farm aesthetic, clean modern, soft natural light, square 1:1",
  melon:
    "Fresh muskmelon on rooftop greenhouse, urban farm aesthetic, clean modern photography, square 1:1",
  sprout:
    "Strawberry seedlings in greenhouse trays, urban farm, clean modern, square 1:1",
};

const results = [];
for (const [cropId, prompt] of Object.entries(PROMPTS)) {
  console.log(`\n[${cropId}] generating...`);
  const t0 = Date.now();
  try {
    const res = await client.images.generate({
      model: "gpt-image-2",
      prompt,
      size: "1024x1024",
      quality: "medium",
      n: 1,
    });
    const ms = Date.now() - t0;
    const item = res.data?.[0];
    if (!item?.b64_json) {
      console.error(`[${cropId}] empty b64_json`);
      results.push({ cropId, ok: false, ms, error: "empty b64_json" });
      continue;
    }
    const buf = Buffer.from(item.b64_json, "base64");
    const path = join(outDir, `${cropId}.png`);
    writeFileSync(path, buf);
    console.log(`[${cropId}] OK (${ms}ms, ${(buf.length / 1024).toFixed(0)}KB) → ${path}`);
    results.push({ cropId, ok: true, ms, bytes: buf.length });
  } catch (err) {
    const ms = Date.now() - t0;
    console.error(
      `[${cropId}] failed (${ms}ms): ${err?.message ?? String(err)}`
    );
    results.push({ cropId, ok: false, ms, error: err?.message ?? String(err) });
  }
}

console.log("\n=== SUMMARY ===");
for (const r of results) {
  console.log(
    r.ok
      ? `✅ ${r.cropId} ${r.ms}ms ${(r.bytes / 1024).toFixed(0)}KB`
      : `❌ ${r.cropId} ${r.ms}ms — ${r.error}`
  );
}
const okCount = results.filter((r) => r.ok).length;
console.log(`${okCount}/${results.length} succeeded`);
process.exit(okCount === results.length ? 0 : 2);
