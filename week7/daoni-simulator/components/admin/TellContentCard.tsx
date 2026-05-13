"use client";

import * as React from "react";
import { CROPS, type Crop } from "@/data/crops";

type TellContent = {
  instagramCaption: string;
  blogPost: string;
  thumbnailUrl: string;
  imageMode: "seed" | "live";
};

type State = "idle" | "loading" | "success" | "error";

export function TellContentCard({
  cropId,
  day,
}: {
  cropId: Crop["id"];
  day: number;
}) {
  const [useLiveImage, setUseLiveImage] = React.useState(false);
  const [state, setState] = React.useState<State>("idle");
  const [data, setData] = React.useState<TellContent | null>(null);
  const [err, setErr] = React.useState("");
  const [elapsed, setElapsed] = React.useState(0);

  const crop = CROPS.find((c) => c.id === cropId);

  function generate() {
    setState("loading");
    setErr("");
    setElapsed(0);
    const t0 = Date.now();
    const tick = window.setInterval(() => {
      setElapsed(Math.round((Date.now() - t0) / 1000));
    }, 500);

    fetch("/api/tell/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cropId, day, useLiveImage }),
    })
      .then(async (r) => {
        clearInterval(tick);
        const json = await r.json();
        if (!r.ok) {
          setErr(json?.error ?? `HTTP ${r.status}`);
          setState("error");
          return;
        }
        setData(json as TellContent);
        setState("success");
      })
      .catch((e) => {
        clearInterval(tick);
        setErr(e instanceof Error ? e.message : String(e));
        setState("error");
      });
  }

  return (
    <div className="space-y-4">
      <div className="bg-base border-[0.5px] border-border rounded-lg p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span
            className="block w-1.5 h-1.5 rounded-full"
            style={{ background: crop?.color }}
          />
          <span className="text-sm text-ink font-medium">
            {crop?.name ?? cropId}
          </span>
          <span className="text-xs text-muted font-mono">Day {day}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={useLiveImage}
              onChange={(e) => setUseLiveImage(e.target.checked)}
              disabled={state === "loading"}
              className="accent-primary"
            />
            라이브 이미지 (gpt-image-2, ~90초)
          </label>
          <button
            onClick={generate}
            disabled={state === "loading"}
            className="bg-primary text-white text-sm font-medium rounded-md px-4 py-1.5 hover:bg-primary-dark disabled:opacity-50"
          >
            {state === "loading" ? "생성 중…" : "콘텐츠 생성"}
          </button>
        </div>
      </div>

      {state === "loading" && (
        <div className="bg-ink text-white rounded-lg p-5 flex gap-3 items-center">
          <span className="block w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          <div className="text-sm text-white/90 flex-1">
            {useLiveImage
              ? `다온이가 이미지 만들고 있어요… ${elapsed}초 / 약 90초`
              : `다온이가 콘텐츠 쓰고 있어요… ${elapsed}초`}
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="bg-base border-[0.5px] border-border rounded-lg p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm text-ink">다온이가 잠시 자리를 비웠어요.</div>
            <div className="text-xs text-muted-light font-mono mt-1 truncate">
              {err.slice(0, 120)}
            </div>
          </div>
          <button
            onClick={generate}
            className="bg-primary text-white text-sm rounded-md px-3 py-1.5 hover:bg-primary-dark shrink-0"
          >
            다시 시도
          </button>
        </div>
      )}

      {state === "success" && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 인스타 미리보기 */}
          <div className="bg-base border-[0.5px] border-border rounded-lg overflow-hidden">
            <div className="text-xs text-muted px-3 pt-3">인스타 미리보기</div>
            <div className="aspect-square bg-surface mt-2 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.thumbnailUrl}
                alt={crop?.name ?? cropId}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-base/90 text-[10px] font-medium rounded-full px-2 py-0.5 text-muted">
                {data.imageMode === "live" ? "🟢 라이브" : "시드"}
              </div>
            </div>
            <div className="p-3 text-sm text-ink whitespace-pre-line">
              {data.instagramCaption}
            </div>
          </div>

          {/* 블로그 글 */}
          <div className="bg-base border-[0.5px] border-border rounded-lg p-4">
            <div className="text-xs text-muted mb-2">블로그 글</div>
            <div className="text-sm text-ink leading-relaxed whitespace-pre-line">
              {data.blogPost}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
