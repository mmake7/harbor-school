import { NextRequest, NextResponse } from "next/server";
import { generateTellContent } from "@/lib/tell";
import type { Crop } from "@/data/crops";

export const dynamic = "force-dynamic";

const VALID_CROP_IDS: Crop["id"][] = ["strawberry", "blueberry", "melon", "sprout"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cropId = body?.cropId as Crop["id"];
    const dayRaw = body?.day;
    const useLiveImage = !!body?.useLiveImage;

    if (!VALID_CROP_IDS.includes(cropId)) {
      return NextResponse.json({ error: `cropId 비유효: ${cropId}` }, { status: 400 });
    }
    const dayParsed = typeof dayRaw === "number" ? dayRaw : parseInt(String(dayRaw), 10);
    const day = Math.max(1, Math.min(365, Number.isFinite(dayParsed) ? dayParsed : 1));

    const content = await generateTellContent(cropId, day, { useLiveImage });
    return NextResponse.json(content);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "서버 오류";
    console.error("[/api/tell/generate]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
