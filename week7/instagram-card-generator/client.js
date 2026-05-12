const { useState, useEffect } = React;

function ImageCell({ data, filename }) {
  if (!data) {
    return <div className="aspect-square w-full bg-neutral-800 rounded flex items-center justify-center text-neutral-500 text-xs">1080×1080</div>;
  }
  const src = data.b64 ? `data:image/png;base64,${data.b64}` : data.url;
  return (
    <div className="flex flex-col gap-2">
      <img src={src} alt="" className="w-full rounded border border-neutral-700" />
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <span>{data.size}</span>
        {data.ms != null && <><span className="text-neutral-600">·</span><span>{(data.ms / 1000).toFixed(1)}s</span></>}
        <a href={src} download={filename} className="ml-auto px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-200">⬇ 다운로드</a>
      </div>
    </div>
  );
}

function ToneCard({ tone, initial }) {
  const [status, setStatus] = useState(initial ? 'done' : 'idle');
  const [image, setImage] = useState(initial || null);
  const [error, setError] = useState(null);

  async function generate() {
    setStatus('loading');
    setError(null);
    setImage(null);
    try {
      const r = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tone: tone.key }) });
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      setImage(j);
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs text-neutral-500 mb-1">{tone.key}</div>
          <h2 className="text-xl font-bold">{tone.name}</h2>
          <p className="text-sm text-neutral-400 mt-1">{tone.summary}</p>
        </div>
        <button
          onClick={generate}
          disabled={status === 'loading'}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 disabled:text-neutral-500 text-neutral-900 font-semibold rounded shrink-0"
        >
          {status === 'loading' ? '생성 중…' : status === 'done' ? '재생성' : '이 톤 생성'}
        </button>
      </div>

      {status === 'loading' && (
        <div className="text-sm text-amber-400 flex items-center gap-2">
          <span className="inline-block w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>
          1080×1080 생성 중 (약 15~25초)
        </div>
      )}
      {status === 'error' && <div className="text-sm text-red-400">에러: {error}</div>}

      <ImageCell data={image} filename={`${tone.key}_1080x1080.png`} />
    </div>
  );
}

function App() {
  const [tones, setTones] = useState([]);
  const [initial, setInitial] = useState({});

  useEffect(() => {
    Promise.all([
      fetch('/api/tones').then(r => r.json()),
      fetch('/api/results').then(r => r.json())
    ]).then(([t, results]) => {
      setTones(t);
      const map = {};
      for (const r of results) map[r.tone] = r;
      setInitial(map);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">인스타 광고 카드 톤 생성기</h1>
        <p className="text-neutral-400 mt-2">5개 톤 × 1080×1080 정사각 = 5장. Instagram feed 표준. G1과 동일한 5톤 — 채널 톤 일관성.</p>
        <p className="text-xs text-neutral-500 mt-2">모델 gpt-image-1 (medium) · 톤당 약 $0.04 · 가사 텍스트 합성 없음, 순수 비주얼.</p>
        <p className="text-xs text-neutral-600 mt-2">기존 생성물은 페이지 로드 시 자동 표시. "재생성" 버튼은 추가 비용 발생.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tones.map(t => <ToneCard key={t.key} tone={t} initial={initial[t.key]} />)}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
