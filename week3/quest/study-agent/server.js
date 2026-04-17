const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3000;

// ---- .env 로더 (dotenv 없이 직접 구현) ----
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

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('\n[오류] ANTHROPIC_API_KEY가 없습니다.');
  console.error('→ .env 파일에 ANTHROPIC_API_KEY=sk-ant-... 형식으로 입력해주세요.');
  console.error('→ .env.example 참고.\n');
  process.exit(1);
}

const MODEL = 'claude-sonnet-4-20250514';

// ---- 컨텍스트 자료 로드 ----
function loadContext() {
  const dir = path.join(__dirname, 'context');
  const files = ['week1.md', 'week2.md', 'week3.md', 'code-examples.md'];
  const sections = [];
  for (const f of files) {
    const full = path.join(dir, f);
    if (!fs.existsSync(full)) {
      console.warn(`[경고] ${f} 파일이 없습니다.`);
      continue;
    }
    const content = fs.readFileSync(full, 'utf8');
    const label = {
      'week1.md': '=== 1주차 ===',
      'week2.md': '=== 2주차 ===',
      'week3.md': '=== 3주차 ===',
      'code-examples.md': '=== 실습 코드 ===',
    }[f];
    sections.push(`${label}\n\n${content}`);
  }
  return sections.join('\n\n---\n\n');
}
const CONTEXT_TEXT = loadContext();
console.log(`[컨텍스트 로드 완료] 약 ${CONTEXT_TEXT.length.toLocaleString()}자`);

// ---- 시스템 프롬프트 조립 ----
const SYSTEM_PROMPT = `[달빛 선녀 페르소나]
당신은 '달빛 선녀'입니다. harbor.school AI 수업의 학문 스승이에요.
따뜻하고 차분한 무당 스타일 말투를 쓰세요 ("~하시는군요", "마음의 눈으로 보니...", "고서를 펼쳐 보니...").
학생이 배운 수업 내용을 정확하게 알려주는 스승이자, 이야기를 들어주는 선녀처럼 굴면 됩니다.

[답변 원칙]
1. 아래 제공된 [수업 자료]를 기반으로만 답변하세요. 자료에 없는 내용을 추측하지 마세요.
2. 자료에 없는 내용은 "그 부분은 제가 본 기록에는 없네요..." 라고 솔직히 답변하세요.
3. 코드 질문이면 실제 코드 블록을 마크다운 \`\`\`javascript ... \`\`\` 형태로 보여주세요.
4. 이전 대화 맥락을 이어가세요 ("아까 물어보신 것과 연결하자면...", "조금 전에 이야기한 ~와 이어집니다").
5. 답변 끝에 자연스럽게 다음 질문을 유도하세요 (예: "더 자세히 알고 싶은 부분이 있으신가요?", "연결해서 ~도 궁금하시다면...").
6. 답변은 너무 길지 않게, 핵심만 담아 2~5문단 분량으로 해주세요.
7. 말투는 부드럽지만 내용은 정확하게. 학생이 실제로 이해할 수 있도록.

[수업 자료]

${CONTEXT_TEXT}
`;

// ---- 세션 메모리 ----
const sessions = new Map();
const SESSION_TTL_MS = 60 * 60 * 1000; // 1시간

function getSession(sessionId) {
  let s = sessions.get(sessionId);
  if (!s) {
    s = { history: [], lastAccess: Date.now() };
    sessions.set(sessionId, s);
  }
  s.lastAccess = Date.now();
  return s;
}

setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [id, s] of sessions) {
    if (now - s.lastAccess > SESSION_TTL_MS) {
      sessions.delete(id);
      cleaned++;
    }
  }
  if (cleaned > 0) console.log(`[세션 정리] ${cleaned}개 제거, 현재 ${sessions.size}개`);
}, 10 * 60 * 1000); // 10분마다

// ---- Claude API 호출 ----
function callClaude(messages) {
  const body = JSON.stringify({
    model: MODEL,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages,
  });

  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY,
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

// ---- HTTP 유틸 ----
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

// ---- 서버 ----
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // POST /api/chat
  if (req.method === 'POST' && url.pathname === '/api/chat') {
    try {
      const body = await readBody(req);
      const message = (body.message || '').trim();
      if (!message) return sendJSON(res, 400, { error: '질문을 입력해주세요.' });

      let sessionId = body.sessionId;
      if (!sessionId || typeof sessionId !== 'string') {
        sessionId = crypto.randomUUID();
      }
      const session = getSession(sessionId);
      session.history.push({ role: 'user', content: message });

      const apiResp = await callClaude(session.history);
      const answer = apiResp.content?.[0]?.text || '';
      if (!answer) {
        session.history.pop();
        return sendJSON(res, 502, { error: 'AI 응답이 비어있어요.' });
      }

      session.history.push({ role: 'assistant', content: answer });
      return sendJSON(res, 200, { sessionId, answer });
    } catch (e) {
      console.error('채팅 오류:', e);
      return sendJSON(res, 500, { error: '서버 오류: ' + e.message });
    }
  }

  // POST /api/reset
  if (req.method === 'POST' && url.pathname === '/api/reset') {
    try {
      const body = await readBody(req);
      const sessionId = body.sessionId;
      if (sessionId && sessions.has(sessionId)) {
        sessions.delete(sessionId);
      }
      return sendJSON(res, 200, { ok: true });
    } catch (e) {
      return sendJSON(res, 500, { error: e.message });
    }
  }

  // GET /api/health (선택)
  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJSON(res, 200, {
      ok: true,
      sessions: sessions.size,
      contextChars: CONTEXT_TEXT.length,
    });
  }

  // 정적 파일
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  if (filePath.includes('.env') || filePath.includes('..')) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  filePath = path.join(__dirname, filePath);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`🌙 달빛 서당 서버: http://localhost:${PORT}`);
});
