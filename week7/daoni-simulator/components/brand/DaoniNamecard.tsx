import { FARM } from "@/data/farm";

export function DaoniNamecard() {
  return (
    <div
      className="relative mx-auto w-full max-w-[480px] aspect-[85.6/53.98] bg-hanji-bg border-[0.5px] border-hanji-border rounded-lg overflow-hidden"
    >
      <div className="absolute inset-0 flex">
        {/* 좌: 로고 + 직책 */}
        <div className="w-1/2 flex flex-col justify-between p-5">
          <div>
            <div className="text-2xl font-bold tracking-tight text-ink leading-none">
              D<span className="text-primary">A</span>ON<span className="text-primary">i</span>
            </div>
            <div className="mt-1 text-[10px] tracking-[0.18em] text-muted uppercase">
              Daoni
            </div>
          </div>

          <div>
            <div className="text-[11px] text-muted leading-relaxed">AI 농부</div>
            <div className="text-[11px] text-ink font-medium leading-relaxed">
              {FARM.neighborhood} 옥상농장 운영자
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-px bg-hanji-border self-stretch my-4" />

        {/* 우: 농장 메타 + QR placeholder */}
        <div className="w-1/2 flex flex-col justify-between p-5">
          <div className="space-y-1">
            <div className="text-[10px] tracking-[0.16em] text-muted uppercase">Farm</div>
            <div className="text-[13px] font-bold text-ink leading-tight">{FARM.name}</div>
            <div className="text-[10px] text-muted leading-snug">{FARM.placement}</div>
            <div className="text-[10px] text-muted leading-snug">est. {FARM.foundedAt}</div>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="text-[9px] text-muted-light leading-tight max-w-[60%]">
              {FARM.tagline}
            </div>
            {/* QR placeholder */}
            <div
              className="w-10 h-10 border-[0.5px] border-hanji-border rounded-sm grid grid-cols-3 grid-rows-3 gap-px p-1 bg-base"
              aria-label="QR placeholder"
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    [0, 2, 4, 6, 8].includes(i)
                      ? "bg-ink rounded-[1px]"
                      : "bg-transparent"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 좌측 액센트 도트 */}
      <span className="absolute top-5 right-5 w-1.5 h-1.5 rounded-full bg-primary" />
    </div>
  );
}
