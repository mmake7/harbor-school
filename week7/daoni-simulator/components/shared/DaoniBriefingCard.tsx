export function DaoniBriefingCard() {
  return (
    <div className="bg-ink text-white rounded-lg p-5 flex gap-3">
      <span className="block w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
      <div className="text-sm leading-relaxed">
        <div className="text-white/70 text-xs mb-1">다온이 브리핑</div>
        <div className="text-white/90">
          오늘의 농장 상태·시장·할 일은 단계 6 이후에 연결돼요.
        </div>
      </div>
    </div>
  );
}
