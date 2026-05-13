import { NextRequest, NextResponse } from "next/server";
import { getTodayRecommendation } from "@/lib/recommend";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("day");
  const parsed = raw ? parseInt(raw, 10) : 1;
  const day = Math.max(1, Math.min(365, Number.isFinite(parsed) ? parsed : 1));

  try {
    const recommendation = await getTodayRecommendation(day);
    return NextResponse.json(recommendation);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "서버 오류";
    console.error("[/api/recommend/today]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
