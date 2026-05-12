const { useState, useEffect } = React;

function ImageCell({ label, data, filename }) {
  if (!data) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="aspect-video w-full bg-neutral-800 rounded flex items-center justify-center text-neutral-500 text-xs">{label}</div>
      </div>
    );
  }
  const src = data.b64 ? `data:image/png;base64,${data.b64}` : data.url;
  return (
    <div className="flex flex-col items-center gap-2">
      <img src={src} alt={label} className="w-full rounded border border-neutral-700" />
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <span>{label}</span>
        <span className="text-neutral-600">·</span>
        <span>{data.size}</span>
        {data.ms != null && <><span className="text-neutral-600">·</span><span>{(data.ms / 1000).toFixed(1)}s</span></>}
        <a href={src} download={filename} className="ml-2 px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-200">⬇ 다운로드</a>
      </div>
    </div>
  );
}

function ToneCard({ tone, initial }) {
  const [status, setStatus] = useState(initial ? 'done' : 'idle');
  const [landscape, setLandscape] = useState(initial?.landscape || null);
  const [portrait, setPortrait] = useState(initial?.portrait || null);
  const [error, setError] = useState(null);

  async function generate() {
    setStatus('loading');
    setError(null);
    setLandscape(null);
    setPortrait(null);
    try {
      const [l, p] = await Promise.all([
        fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tone: tone.key, orientation: 'landscape' }) }).then(r => r.json()),
        fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tone: tone.key, orientation: 'portrait' }) }).then(r => r.json())
      ]);
      if (l.error || p.error) throw new Error(l.error || p.error);
      setLandscape(l);
      setPortrait(p);
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
          가로 + 세로 동시 생성 중 (약 20~40초)
        </div>
      )}
      {status === 'error' && (
        <div className="text-sm text-red-400">에러: {error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div className="md:col-span-2">
          <ImageCell label="가로 1920×1080" data={landscape} filename={`${tone.key}_1920x1080.png`} />
        </div>
        <div>
          <ImageCell label="세로 1080×1920" data={portrait} filename={`${tone.key}_1080x1920.png`} />
        </div>
      </div>
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
      const grouped = {};
      for (const r of results) {
        if (!grouped[r.tone]) grouped[r.tone] = {};
        grouped[r.tone][r.orientation] = r;
      }
      setInitial(grouped);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">YouTube 썸네일 톤 생성기</h1>
        <p className="text-neutral-400 mt-2">5개 톤 × (가로 1920×1080 + 세로 1080×1920) = 10장. 톤별 버튼 클릭 시 가로·세로 동시 생성.</p>
        <p className="text-xs text-neutral-500 mt-2">모델 gpt-image-1 (medium) · 톤당 약 $0.08 · 가사 텍스트 합성 없음, 순수 비주얼.</p>
        <p className="text-xs text-neutral-600 mt-2">기존 생성물은 페이지 로드 시 자동 표시. "재생성" 버튼은 추가 비용 발생.</p>
      </header>

      <div className="flex flex-col gap-6">
        {tones.map(t => <ToneCard key={t.key} tone={t} initial={initial[t.key]} />)}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
