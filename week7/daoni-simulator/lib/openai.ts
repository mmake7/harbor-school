// 다온이는 신모델 사용 (INVENTORY 7주차 호출은 모두 gpt-image-1)
// 실 호출은 Day 2+ Tell 모듈
import OpenAI from "openai";

export const IMAGE_MODEL = "gpt-image-2";

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY 미설정");
    _client = new OpenAI({ apiKey: key });
  }
  return _client;
}

export type ImageOptions = {
  size?: "1024x1024" | "1024x1536" | "1536x1024";
  quality?: "low" | "medium" | "high";
};

export async function generateImage(prompt: string, options: ImageOptions = {}) {
  return getClient().images.generate({
    model: IMAGE_MODEL,
    prompt,
    size: options.size ?? "1024x1024",
    quality: options.quality ?? "medium",
    n: 1,
  });
}
