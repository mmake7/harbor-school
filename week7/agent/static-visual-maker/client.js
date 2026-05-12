const { useState, useEffect } = React;

function TypePicker({ types, selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {types.map(t => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`text-left p-5 rounded-lg border transition ${selected === t.id ? 'border-amber-400 bg-neutral-800' : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'}`}
        >
          <div className="text-xs text-neutral-500 mb-1">{t.id}</div>
          <h3 className="text-lg font-bold">{t.label}</h3>
          <p className="text-sm text-neutral-400 mt-1">{t.summary}</p>
          <p className="text-xs text-neutral-500 mt-2">{t.compositionHint}</p>
        </button>
      ))}
    </div>
  );
}

function OutputCell({ output, filename }) {
  if (!output) {
    return <div className="w-full bg-neutral-800 rounded aspect-video flex items-center justify-center text-neutral-500 text-xs">대기</div>;
  }
  return (
    <div className="flex flex-col gap-2">
      <img src={output.url} alt={output.name} className="w-full rounded border border-neutral-700" />
      <div className="flex items-center gap-2 text-xs text-neutral-400 flex-wrap">
        <span>{output.name}</span>
        <span className="text-neutral-600">·</span>
        <span>{output.finalSize}</span>
        {output.ms != null && <><span className="text-neutral-600">·</span><span>{(output.ms / 1000).toFixed(1)}s</span></>}
        <a href={output.url} download={filename} className="ml-auto px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-200">⬇ 다운로드</a>
      </div>
    </div>
  );
}

function ToneCard({ tone, visualType, initial }) {
  const [status, setStatus] = useState(initial ? 'done' : 'idle');
  const [outputs, setOutputs] = useState(initial || []);
  const [error, setError] = useState(null);

  async function generate() {
    setStatus('loading');
    setError(null);
    setOutputs([]);
    try {
      const r = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ toneId: tone.id, visualTypeId: visualType.id }) });
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      setOutputs(j.outputs);
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  const cols = visualType.outputs.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs text-neutral-500 mb-1">{tone.id}</div>
          <h2 className="text-xl font-bold">{tone.label}</h2>
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
          {visualType.outputs.length}장 동시 생성 중 (약 15~40초)
        </div>
      )}
      {status === 'error' && <div className="text-sm text-red-400">에러: {error}</div>}

      <div className={`grid gap-4 ${cols}`}>
        {visualType.outputs.map((o, i) => (
          <OutputCell key={o.name} output={outputs[i]} filename={`${tone.id}__${visualType.id}__${o.name}_${o.finalSize}.png`} />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [tones, setTones] = useState([]);
  const [visualTypes, setVisualTypes] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/tones').then(r => r.json()),
      fetch('/api/visual-types').then(r => r.json()),
      fetch('/api/results').then(r => r.json())
    ]).then(([t, vt, r]) => {
      setTones(t);
      setVisualTypes(vt);
      setResults(r);
    });
  }, []);

  const selectedType = visualTypes.find(v => v.id === selectedTypeId);

  // group results by toneId for selectedType
  const initialByTone = {};
  if (selectedType) {
    for (const r of results) {
      if (r.visualTypeId !== selectedType.id) continue;
      if (!initialByTone[r.toneId]) initialByTone[r.toneId] = [];
      const idx = selectedType.outputs.findIndex(o => o.name === r.outputName);
      if (idx >= 0) initialByTone[r.toneId][idx] = { name: r.outputName, finalSize: r.finalSize, url: r.url };
    }
    // filter incomplete sets out (require all outputs present)
    for (const k of Object.keys(initialByTone)) {
      const arr = initialByTone[k];
      const complete = selectedType.outputs.every((_, i) => arr[i]);
      if (!complete) delete initialByTone[k];
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Static Visual Maker</h1>
        <p className="text-neutral-400 mt-2">5톤 × 3가지 비주얼 타입 통합 생성기. G1·G2·G3 패턴을 config로 추상화.</p>
        <p className="text-xs text-neutral-500 mt-2">모델 gpt-image-1 (medium) · 텍스트 합성 없음, 순수 비주얼.</p>
      </header>

      <section className="mb-10">
        <h2 className="text-sm font-bold text-neutral-300 mb-3 uppercase tracking-wide">1단계 · 비주얼 타입</h2>
        <TypePicker types={visualTypes} selected={selectedTypeId} onSelect={setSelectedTypeId} />
      </section>

      {selectedType && (
        <section>
          <h2 className="text-sm font-bold text-neutral-300 mb-3 uppercase tracking-wide">2단계 · 톤별 생성 — {selectedType.label}</h2>
          <p className="text-xs text-neutral-600 mb-4">기존 결과는 자동 표시. "재생성" 버튼은 추가 비용 발생.</p>
          <div className="flex flex-col gap-6">
            {tones.map(t => <ToneCard key={t.id} tone={t} visualType={selectedType} initial={initialByTone[t.id]} />)}
          </div>
        </section>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
