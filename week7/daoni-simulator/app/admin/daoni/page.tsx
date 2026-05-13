export default function DaoniChatPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">다온이</h1>
        <p className="text-sm text-muted mt-1">
          궁금한 거 물어봐요. moon.js 듀오 페르소나 패턴으로 단계 6 이후 연결해요.
        </p>
      </header>

      <div className="bg-base border-[0.5px] border-border rounded-lg p-4 space-y-3 min-h-[400px]">
        <div className="flex justify-start">
          <div className="bg-ink text-white rounded-lg p-3 max-w-[75%] text-sm flex gap-2">
            <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            <div>저는 다온이예요. 오늘 농장은 잘 쉬고 있어요.</div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-primary-light text-ink rounded-lg p-3 max-w-[75%] text-sm">
            오늘 추천 작물 알려줘.
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-ink text-white rounded-lg p-3 max-w-[75%] text-sm flex gap-2">
            <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            <div>응답 흐름은 단계 6 이후에 연결돼요.</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border-[0.5px] border-border rounded-md px-3 py-2 text-sm bg-base disabled:bg-surface"
          placeholder="단계 6 이후 입력 가능"
          disabled
        />
        <button
          className="bg-primary text-white text-sm font-medium rounded-md px-4 py-2 disabled:opacity-50"
          disabled
        >
          전송
        </button>
      </div>
    </div>
  );
}
