import { NextRequest, NextResponse } from "next/server";
import { callDaoniChat, type ChatMessage } from "@/lib/chat";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body?.messages as ChatMessage[];
    const dayRaw = body?.day;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages 배열 필요" }, { status: 400 });
    }
    const dayParsed = typeof dayRaw === "number" ? dayRaw : parseInt(String(dayRaw), 10);
    const day = Math.max(1, Math.min(365, Number.isFinite(dayParsed) ? dayParsed : 1));

    const content = await callDaoniChat({ messages, day });
    return NextResponse.json({ content });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "서버 오류";
    console.error("[/api/chat]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
