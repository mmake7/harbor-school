# 실습 코드 발췌 — harbor.school 1~3주차

수업 흐름에서 반복적으로 등장한 9가지 코드 패턴.

---

## 1. Node http 서버 기본형 (server-test)

```javascript
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/hello') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ message: '안녕하세요!' }));
    return;
  }
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
```

**핵심**:
- `http.createServer`의 콜백은 `(req, res) => {}` 형태.
- `res.writeHead(상태, 헤더객체)` → `res.end(본문)` 순서를 꼭 지킬 것.
- 반드시 `res.end()`를 호출해야 연결이 끊긴다.

---

## 2. CRUD 라우팅 (hellow-server 스타일)

```javascript
const http = require('http');
const crypto = require('crypto');

const users = new Map();  // 인메모리 DB

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (e) { reject(e); }
    });
  });
}

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // GET /users
  if (req.method === 'GET' && url.pathname === '/users') {
    return json(res, 200, [...users.values()]);
  }

  // POST /users
  if (req.method === 'POST' && url.pathname === '/users') {
    const body = await readBody(req);
    if (!body.name) return json(res, 400, { error: 'name 필수' });
    const user = { id: crypto.randomUUID(), name: body.name };
    users.set(user.id, user);
    return json(res, 201, user);
  }

  // GET /users/:id
  const match = url.pathname.match(/^\/users\/(.+)$/);
  if (match) {
    const id = match[1];
    if (req.method === 'GET') {
      const user = users.get(id);
      return user ? json(res, 200, user) : json(res, 404, { error: '없음' });
    }
    if (req.method === 'DELETE') {
      users.delete(id);
      return json(res, 204, {});
    }
  }

  json(res, 404, { error: 'Not Found' });
});
```

**핵심**:
- `URL` 객체로 pathname/query 파싱
- 정규식으로 `/users/:id` 같은 경로 파라미터 추출
- `req.on('data')` → `req.on('end')` 패턴을 Promise로 감싸면 `await` 사용 가능

---

## 3. 직접 구현한 .env 로더 (mental-chat v2 / 이 프로젝트)

```javascript
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('[오류] ANTHROPIC_API_KEY가 없습니다.');
  process.exit(1);
}
```

**핵심**:
- `dotenv` 패키지 없이도 20줄로 구현 가능.
- 주석(`#`)·따옴표 처리·빈 줄 무시만 챙기면 충분.
- 키가 없으면 **즉시 종료**. fallback을 두지 말 것.

---

## 4. OpenAI API 호출 (mental-chat v2, 내장 fetch)

```javascript
async function callOpenAI(messages) {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '당신은 따뜻한 심리상담사입니다. 반영적 경청을 사용하고 진단은 하지 마세요. 자해/자살 암시 시 1393을 안내하세요.' },
        ...messages,
      ],
      temperature: 0.7,
    }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`OpenAI 오류: ${err}`);
  }
  const data = await resp.json();
  return data.choices[0].message.content;
}
```

**핵심**:
- Node 18+는 `fetch`가 내장되어 SDK 없이 호출 가능.
- OpenAI는 `messages` 배열에 system/user/assistant role을 섞어 넣는다.

---

## 5. Anthropic Claude API 호출 (https 모듈 / 별명 공방 · 달빛 서당)

```javascript
const https = require('https');

function callClaude(messages, systemPrompt) {
  const body = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  });

  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-length': Buffer.byteLength(body),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode !== 200) {
            return reject(new Error(parsed.error?.message || `API 오류 (${res.statusCode})`));
          }
          resolve(parsed);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
```

**핵심**:
- Claude는 `system`이 **별도 필드**. OpenAI는 `messages[0]`에 role=system.
- 헤더 `x-api-key`, `anthropic-version: 2023-06-01` 필수.
- 응답은 `content[0].text`에 들어있다.

---

## 6. CORS / 바디 파싱 기본 패턴

```javascript
// CORS 허용 (개발용)
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

// preflight
if (req.method === 'OPTIONS') {
  res.writeHead(204);
  return res.end();
}

// 바디 파싱
let raw = '';
req.on('data', (chunk) => { raw += chunk; });
req.on('end', () => {
  const body = JSON.parse(raw);
  // ... 처리
});
```

**핵심**:
- CORS는 **브라우저가 거는 제한**이지 서버의 문제가 아니다.
- 같은 도메인에서 정적 파일 + API를 함께 제공하면 CORS가 아예 안 걸린다 (my-pokemon-docs 패턴).

---

## 7. React CDN 부팅 템플릿 (NASA APOD, mental-chat v2)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;
    function App() {
      const [count, setCount] = useState(0);
      return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```

**핵심**:
- `<script type="text/babel">` 안에 JSX를 그대로 쓸 수 있다.
- Babel Standalone이 브라우저에서 실시간 컴파일.
- 프로덕션에는 부적합하지만, 학습/프로토타입에는 최고.

---

## 8. 캐싱 / 메모이제이션 (pokemon-docs)

```jsx
// 외부 모듈 변수로 영속적 캐시
const pokemonCache = new Map();

function PokemonCard({ id }) {
  const [data, setData] = useState(pokemonCache.get(id) || null);

  useEffect(() => {
    if (pokemonCache.has(id)) return;        // 이미 있으면 스킵
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((r) => r.json())
      .then((d) => {
        pokemonCache.set(id, d);
        setData(d);
      });
  }, [id]);

  return data ? <div>{data.name}</div> : <div>로딩...</div>;
}

// useMemo로 검색 결과 메모이제이션
const filtered = useMemo(() => {
  return pokemons.filter((p) => p.name.includes(query));
}, [pokemons, query]);
```

**핵심**:
- `useState`는 컴포넌트 언마운트 시 사라짐 → **영속 캐시는 모듈 변수**에.
- `useMemo`는 의존성 배열이 안 바뀌면 재계산 스킵.

---

## 9. 시스템 프롬프트 예시 (mental-chat)

```text
당신은 따뜻하고 공감적인 심리상담사 '마음이'입니다.

[답변 원칙]
1. 반영적 경청을 사용하세요 ("~ 느끼셨군요", "~ 힘드셨겠어요").
2. 진단하지 마세요. "우울증인 것 같다" 같은 말 금지.
3. 조언보다는 감정을 먼저 공감하세요.
4. 2-3문장으로 짧게 답하세요.

[위기 대응]
사용자가 자해/자살을 암시하면 반드시:
- 공감 표현
- "지금 힘드시다는 신호가 느껴져요"
- 자살예방상담전화 1393, 정신건강위기상담 1577-0199 안내
- 절대 무시하거나 가볍게 넘기지 말 것
```

**핵심**:
- 페르소나 + 답변 원칙 + 안전 가이드라인 세 블록 구조.
- "~하지 마세요"도 구체적으로 지정해야 모델이 실제로 피한다.
- 위기 상황은 **별도 블록**으로 빼서 우선순위를 높인다.
