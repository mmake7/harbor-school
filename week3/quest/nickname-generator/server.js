const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

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

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const STYLE_GUIDES = {
  cute: {
    name: '귀여운 스타일',
    guide: '말랑, 뽀송, 몽실, 보들, 폭신 같은 의태어/의성어를 활용. 받침이 적고 발음하기 귀여운 이름. 예: "말랑이", "뽀송뽀송", "보들이".',
  },
  fantasy: {
    name: '판타지/게임 스타일',
    guide: 'RPG 게임의 칭호(속성의 직업 + 이름) 패턴. 예: "천둥의 검객 민수", "그림자 마법사 유송", "붉은 불꽃 궁수".',
  },
  joseon: {
    name: '조선시대 스타일',
    guide: '옛 호칭(도령/선비/거사/처사/낭자/아씨) + 아호(자연을 딴 호) 조합. 예: "청산 거사", "박씨 선비", "유송 도령".',
  },
  animal: {
    name: '동물 별명 스타일',
    guide: '동물 이름 + 귀여운 접미사(이, 순이, 왕자, 공주, 요정). 예: "냥냥이", "토끼왕자", "다람쥐 요정".',
  },
  office: {
    name: '직장인 밈 스타일',
    guide: '직장인 현실 유머(야근/월급/칼퇴/회식/보고)를 살린 밈식 별명. 예: "야근요정", "월급루팡", "퇴근부장".',
  },
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

function callClaude(messages, system) {
  const body = JSON.stringify({
    model: MODEL,
    max_tokens: 1024,
    system,
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

function buildUserMessage(profile, styleKey) {
  const style = STYLE_GUIDES[styleKey];
  const parts = [];
  parts.push(`[선택된 스타일] ${style.name}`);
  parts.push(`[스타일 가이드] ${style.guide}`);
  parts.push('');
  parts.push('[사용자 정보]');
  parts.push(`- 이름: ${profile.name}`);
  if (profile.personality) parts.push(`- 성격: ${profile.personality}`);
  if (profile.hobby) parts.push(`- 취미: ${profile.hobby}`);
  if (profile.mbti) parts.push(`- MBTI: ${profile.mbti}`);
  if (profile.favoriteAnimal) parts.push(`- 좋아하는 동물: ${profile.favoriteAnimal}`);
  if (profile.luckyThing) parts.push(`- 행운의 숫자/색깔: ${profile.luckyThing}`);
  if (profile.job) parts.push(`- 직업/상황: ${profile.job}`);
  if (profile.oneWord) parts.push(`- 한 단어 자기소개: ${profile.oneWord}`);
  if (profile.fantasyClass) parts.push(`- 판타지 직업: ${profile.fantasyClass}`);
  if (profile.dayNight) parts.push(`- 낮/밤형: ${profile.dayNight}`);
  if (profile.catchphrase) parts.push(`- 요즘 자주 하는 말: ${profile.catchphrase}`);
  parts.push('');
  parts.push('위 정보를 바탕으로 [선택된 스타일]에 맞는 별명 5개를 지어주세요. 지정된 JSON 형식으로만 응답하세요.');
  return parts.join('\n');
}

const SYSTEM_PROMPT = `당신은 재미있고 창의적인 별명을 지어주는 AI 작명가입니다.

사용자 정보를 바탕으로 [선택된 스타일]에 맞는 별명 5개를 생성하세요.

반드시 아래 JSON 형식으로만 응답하세요 (마크다운 코드블록, 다른 설명 일절 없이 순수 JSON만):

{
  "nicknames": [
    {
      "name": "별명",
      "emoji": "대표이모지 1개",
      "meaning": "짧은 의미/설명 (20자 이내)"
    }
  ]
}

규칙:
- 정확히 5개의 별명을 생성.
- 각 별명은 서로 다른 느낌과 뉘앙스.
- 사용자 이름/성격/취미 등을 자연스럽게 녹여 넣되, 선택된 스타일을 최우선으로.
- emoji는 별명 분위기에 맞는 것 1개만.
- meaning은 20자 이내 짧은 한 줄 설명.
- 중복 금지, 유치하지 않게, 한글로.`;

function extractJSON(text) {
  // 모델이 혹시 코드블록을 씌워도 안전하게 파싱
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenceMatch ? fenceMatch[1].trim() : trimmed;
  return JSON.parse(raw);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'POST' && url.pathname === '/api/generate') {
    try {
      const body = await readBody(req);
      const { profile, style } = body;
      if (!profile || !profile.name || !profile.name.trim()) {
        return sendJSON(res, 400, { error: '이름은 필수 항목입니다.' });
      }
      if (!style || !STYLE_GUIDES[style]) {
        return sendJSON(res, 400, { error: '스타일을 선택해주세요.' });
      }

      const userMessage = buildUserMessage(profile, style);
      const apiResp = await callClaude(
        [{ role: 'user', content: userMessage }],
        SYSTEM_PROMPT
      );
      const text = apiResp.content?.[0]?.text || '';
      let parsed;
      try {
        parsed = extractJSON(text);
      } catch (e) {
        console.error('JSON 파싱 실패, 원문:', text);
        return sendJSON(res, 502, { error: 'AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요.' });
      }

      if (!Array.isArray(parsed.nicknames) || parsed.nicknames.length === 0) {
        return sendJSON(res, 502, { error: '별명 생성 결과가 비어있습니다.' });
      }

      return sendJSON(res, 200, { nicknames: parsed.nicknames });
    } catch (e) {
      console.error('생성 오류:', e);
      return sendJSON(res, 500, { error: '서버 오류: ' + e.message });
    }
  }

  // 정적 파일
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  // .env류는 외부에서 접근 불가
  if (filePath.includes('.env')) {
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
  console.log(`AI 별명 공방 서버: http://localhost:${PORT}`);
});
