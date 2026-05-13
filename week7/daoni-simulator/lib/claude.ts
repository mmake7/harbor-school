// dongne-golmok/api/ai.js:143-153 ephemeral prompt caching 패턴 이식
// 실 호출은 Day 2+ 모듈 구현 시
import Anthropic from "@anthropic-ai/sdk";
import { FARM } from "@/data/farm";

export const MODEL = "claude-sonnet-4-6";

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("ANTHROPIC_API_KEY 미설정");
    _client = new Anthropic({ apiKey: key });
  }
  return _client;
}

export function buildDaoniPersonaSystem(): string {
  return `${FARM.daoniPersona}

# 농장 정보
- 이름: ${FARM.name}
- 위치: ${FARM.location} (${FARM.neighborhood})
- 규모: ${FARM.placement}
- 시작: ${FARM.foundedAt}`;
}

export type SystemBlock = {
  type: "text";
  text: string;
  cache_control?: { type: "ephemeral" };
};

export async function callClaude(
  systemBlocks: SystemBlock[],
  userMessage: string,
  maxTokens = 600
) {
  return getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemBlocks,
    messages: [{ role: "user", content: userMessage }],
  });
}

// 멀티턴 챗 — messages 배열 그대로 전달
export type ChatTurnMessage = { role: "user" | "assistant"; content: string };

export async function callClaudeMessages(
  systemBlocks: SystemBlock[],
  messages: ChatTurnMessage[],
  opts?: { maxTokens?: number; temperature?: number }
) {
  return getClient().messages.create({
    model: MODEL,
    max_tokens: opts?.maxTokens ?? 600,
    temperature: opts?.temperature,
    system: systemBlocks,
    messages,
  });
}
