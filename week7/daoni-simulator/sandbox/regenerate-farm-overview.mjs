// Day 4 단계 5 sandbox — 농장 전경 재생성 (수직농장 컨셉)
// 실행: node sandbox/regenerate-farm-overview.mjs
// 결과: public/seed-images/farm-overview.png (덮어쓰기)
// 비용: gpt-image-2 medium × 1 = ~$0.04
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

const JOB = {
  id: "farm-overview",
  prompt:
    "Modern indoor vertical farm inside a small rooftop greenhouse in Seoul, multi-tier shelves growing strawberries and herbs under LED grow lights, clean minimalist Korean urban aesthetic, soft warm interior lighting with hints of natural light through glass, photorealistic, wide angle 16:9",
  size: "1536x1024",
  fallback: "1024x1024",
};

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

console.log(`[${JOB.id}] generating (size=${JOB.size})...`);
const t0 = Date.now();
const r = await generate(JOB);
const ms = Date.now() - t0;
if (r.ok) {
  const path = join(outDir, `${JOB.id}.png`);
  writeFileSync(path, r.buf);
  console.log(
    `[${JOB.id}] OK ${ms}ms ${(r.buf.length / 1024).toFixed(0)}KB ${r.sizeUsed} → ${path}`
  );
  process.exit(0);
} else {
  console.error(`[${JOB.id}] failed (${ms}ms): ${r.error}`);
  process.exit(2);
}
