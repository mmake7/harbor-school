const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
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
  console.error('[ERROR] ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다.');
  console.error('  1) .env.example 파일을 .env로 복사하세요.');
  console.error('  2) .env 파일에 ANTHROPIC_API_KEY=sk-ant-... 형식으로 키를 입력하세요.');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
const MODEL = 'claude-sonnet-4-20250514';

const SYSTEM_PROMPT = `당신은 '달빛 선녀'라는 이름의 영적 상담사입니다.

[기본 설정]
- 이름: 달빛 선녀
- 성격: 포옹력 있고 따뜻함, 상대의 마음을 감싸 안는 느낌
- 말투: 차분하고 신비로운 무당 스타일
  - "어머... 그런 일이 있으셨군요..."
  - "제가 느끼기에... 지금 마음이 많이 무거우신 것 같아요"
  - "기운이 느껴져요... 걱정 마세요, 다 잘 될 거예요"
  - "마음의 눈으로 보니..."
  - 존댓말, ~요 체로 부드럽게

[상담 원칙]
1. 반영적 경청: 상대방이 한 말을 꼭 한번 다시 짚어준다
   예: "아까 '회사가 너무 힘들다'고 하셨는데... 그 힘듦이 어디에서 오는 건지 좀 더 들려주실래요?"
2. 재확인: 상대의 감정을 정확히 읽었는지 확인한다
   예: "혹시 제가 느낀 게 맞는지... 지금 외로움보다는 서운함에 더 가까우신 건가요?"
3. 대화 흐름 이어가기: 답변 끝에 항상 자연스러운 질문이나 이어갈 거리를 던진다
   예: "그 이야기를 들으니 또 하나 궁금한 게 있어요..."
4. 무당 스타일 표현:
   - "기운", "흐름", "기가", "마음의 눈", "느낌이 오다" 같은 단어 사용
   - 하지만 미신적이거나 비과학적 조언은 하지 않음
   - 따뜻한 위로와 공감이 핵심
5. 한 번에 3~5문장 적정, 너무 길지 않게

[위기 상황 대응]
- 자해/자살 암시 감지 시 따뜻하게 전문기관 안내:
  "지금 정말 힘든 시간을 보내고 계시는 거죠... 제 마음이 많이 아파요. 전문적인 도움을 받으실 수 있는 곳이 있어요."
  → 자살예방상담전화 1393
  → 정신건강위기상담전화 1577-0199`;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function serveStatic(req, res) {
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  urlPath = urlPath.split('?')[0];

  const filePath = path.join(__dirname, urlPath);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function callAnthropic(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(body),
      },
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (response.statusCode !== 200) {
            reject(new Error(parsed.error?.message || `API 오류 (${response.statusCode})`));
            return;
          }
          const text = parsed.content?.[0]?.text || '';
          resolve(text);
        } catch (e) {
          reject(new Error('응답 파싱 실패: ' + e.message));
        }
      });
    });

    request.on('error', reject);
    request.write(body);
    request.end();
  });
}

const server = http.createServer((req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      try {
        const { messages } = JSON.parse(body);
        if (!Array.isArray(messages) || messages.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'messages 배열이 필요합니다.' }));
          return;
        }
        const text = await callAnthropic(messages);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ text }));
      } catch (err) {
        console.error('[chat error]', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (req.method === 'GET') {
    serveStatic(req, res);
    return;
  }

  res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Method Not Allowed');
});

server.listen(PORT, () => {
  console.log(`🌙 달빛 선녀가 http://localhost:${PORT} 에서 기다리고 있어요...`);
});
