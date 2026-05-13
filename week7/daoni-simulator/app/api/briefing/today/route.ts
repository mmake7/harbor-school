import { NextRequest, NextResponse } from "next/server";
import { getDailyBriefing } from "@/lib/briefing";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("day");
  const parsed = raw ? parseInt(raw, 10) : 1;
  const day = Math.max(1, Math.min(365, Number.isFinite(parsed) ? parsed : 1));

  try {
    const briefing = await getDailyBriefing(day);
    return NextResponse.json(briefing);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "서버 오류";
    console.error("[/api/briefing/today]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
