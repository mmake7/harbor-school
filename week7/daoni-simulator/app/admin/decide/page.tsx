import { CROPS } from "@/data/crops";

export default function DecidePage() {
  const recommended = CROPS[0];
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">결정</h1>
        <p className="text-sm text-muted mt-1">이번 시즌은 시장 신호를 보고 추천합니다.</p>
      </header>

      <div className="bg-ink text-white rounded-lg p-6 flex gap-3">
        <span className="block w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
        <div className="text-sm leading-relaxed">
          <div className="text-white/70 text-xs mb-1">다온이 추천</div>
          <div className="text-white/90">
            이번 분기 추천 작물:{" "}
            <span className="font-medium" style={{ color: recommended.color }}>
              {recommended.name}
            </span>
            . 근거(시장 가격·수요·기상)는 단계 6 이후에 연결돼요.
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">시장 데이터</h2>
        <div className="bg-base border-[0.5px] border-border rounded-lg p-6 text-center text-sm text-muted font-mono">
          mock-market.ts에서 import 예정
        </div>
      </section>
    </div>
  );
}
