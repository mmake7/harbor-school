// Day 4 단계 4 sandbox — 꿀병 3장 + 농장 전경 1장 생성
// 실행: node sandbox/generate-honey-and-farm-images.mjs
// 결과: public/seed-images/{strawberry-honey,blueberry-honey,melon-honey,farm-overview}.png
// 비용: gpt-image-2 medium × 4 = ~$0.16
import OpenAI from "openai";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

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

// id, prompt, preferredSize, fallbackSize(optional)
const JOBS = [
  {
    id: "strawberry-honey",
    prompt:
      "Fresh strawberry honey in glass jar on rooftop urban farm wooden table, soft natural light, clean modern minimalist photography, square 1:1",
    size: "1024x1024",
  },
  {
    id: "blueberry-honey",
    prompt:
      "Fresh blueberry honey in glass jar on rooftop urban farm, soft natural light, clean modern minimalist photography, square 1:1",
    size: "1024x1024",
  },
  {
    id: "melon-honey",
    prompt:
      "Fresh melon honey in glass jar on rooftop greenhouse, soft natural light, clean modern minimalist photography, square 1:1",
    size: "1024x1024",
  },
  {
    id: "farm-overview",
    prompt:
      "Small urban rooftop farm in Seoul, strawberry plants in greenhouse trays, golden hour soft natural light, clean modern photography, wide angle, 16:9 aspect",
    size: "1536x1024",
    fallback: "1024x1024",
  },
];

async function generate(job) {
  const tryOnce = async (size) => {
    const res = await client.images.generate({
      model: "gpt-image-2",
      prompt: job.prompt,
      size,
      quality: "medium",
      n: 1,
    });
    const item = res.data?.[0];
    if (!item?.b64_json) throw new Error("empty b64_json");
    return Buffer.from(item.b64_json, "base64");
  };

  try {
    const buf = await tryOnce(job.size);
    return { ok: true, buf, sizeUsed: job.size };
  } catch (err) {
    if (job.fallback) {
      console.warn(
        `[${job.id}] ${job.size} failed (${err?.message}), retry ${job.fallback}`
      );
      try {
        const buf = await tryOnce(job.fallback);
        return { ok: true, buf, sizeUsed: job.fallback };
      } catch (err2) {
        return { ok: false, error: err2?.message ?? String(err2) };
      }
    }
    return { ok: false, error: err?.message ?? String(err) };
  }
}

const results = [];
for (const job of JOBS) {
  console.log(`\n[${job.id}] generating (size=${job.size})...`);
  const t0 = Date.now();
  const r = await generate(job);
  const ms = Date.now() - t0;
  if (r.ok) {
    const path = join(outDir, `${job.id}.png`);
    writeFileSync(path, r.buf);
    console.log(
      `[${job.id}] OK ${ms}ms ${(r.buf.length / 1024).toFixed(0)}KB ${r.sizeUsed} → ${path}`
    );
    results.push({ id: job.id, ok: true, ms, bytes: r.buf.length, sizeUsed: r.sizeUsed });
  } else {
    console.error(`[${job.id}] failed (${ms}ms): ${r.error}`);
    results.push({ id: job.id, ok: false, ms, error: r.error });
  }
}

console.log("\n=== SUMMARY ===");
for (const r of results) {
  console.log(
    r.ok
      ? `✅ ${r.id} ${r.ms}ms ${(r.bytes / 1024).toFixed(0)}KB (${r.sizeUsed})`
      : `❌ ${r.id} ${r.ms}ms — ${r.error}`
  );
}
const okCount = results.filter((r) => r.ok).length;
console.log(`${okCount}/${results.length} succeeded`);
process.exit(okCount === results.length ? 0 : 2);
