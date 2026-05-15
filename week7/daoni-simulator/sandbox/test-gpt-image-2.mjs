// Day 2 단계 1 sandbox — gpt-image-2 존재 여부 + fallback 검증
// 실행: node sandbox/test-gpt-image-2.mjs (cwd = daoni-simulator)
// 보안: API 키 echo X · b64_json 본문 출력 X · 길이·키 구조만
import OpenAI from "openai";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const envText = readFileSync(join(root, ".env.local"), "utf8");
const m = envText.match(/^\s*OPENAI_API_KEY\s*=\s*(\S+)/m);
if (!m) {
  console.error("OPENAI_API_KEY not found in .env.local");
  process.exit(1);
}
const apiKey = m[1];

const client = new OpenAI({ apiKey });

const PROMPT =
  "A simple icon of a strawberry on white background, flat design, minimal";

const MODELS = [
  "gpt-image-2",
  "gpt-image-2-2026-04-21",
  "gpt-image-1.5",
  "gpt-image-1",
];

let success = null;

for (const model of MODELS) {
  console.log(`\n[try] model=${model}`);
  const t0 = Date.now();
  try {
    const res = await client.images.generate({
      model,
      prompt: PROMPT,
      size: "1024x1024",
      quality: "medium",
      n: 1,
    });
    const ms = Date.now() - t0;
    const item = res.data?.[0];
    if (!item) {
      console.error(`[${model}] empty data array`);
      continue;
    }
    const keys = Object.keys(item);
    const b64Len = item.b64_json?.length ?? 0;
    const urlLen = item.url?.length ?? 0;
    const revisedLen = item.revised_prompt?.length ?? 0;
    console.log(`✅ ${model} OK (${ms}ms)`);
    console.log(
      `   keys=[${keys.join(",")}] b64_len=${b64Len} url_len=${urlLen} revised_prompt_len=${revisedLen}`
    );
    success = { model, keys, b64Len, urlLen, revisedLen, ms };
    break;
  } catch (err) {
    const ms = Date.now() - t0;
    const status = err?.status ?? "?";
    const code = err?.code ?? err?.error?.code ?? "?";
    const type = err?.type ?? err?.error?.type ?? "?";
    const msg = (err?.message ?? String(err)).slice(0, 240);
    console.error(
      `❌ ${model} failed (${ms}ms · status=${status} code=${code} type=${type})\n   ${msg}`
    );
  }
}

console.log("\n===");
if (success) {
  console.log(`FINAL: ${success.model}`);
  console.log(
    `       keys=[${success.keys.join(",")}] b64_len=${success.b64Len}`
  );
} else {
  console.error("FINAL: all 4 models failed");
  console.error(
    "       check → key 권한 · org access · 잔액 · rate limit · 네트워크"
  );
  process.exit(2);
}
