const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const STYLE_PROMPT = 'Korean traditional ink painting on hanji paper, Kim Hong-do and Shin Yun-bok style, 18th century Joseon dynasty, black ink brush strokes with subtle color washes, elegant and minimal composition, traditional East Asian aesthetic, soft beige hanji paper background, refined brushwork, clear ink lines';

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
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function buildImageUrl(userPrompt) {
  const combined = `${userPrompt}, ${STYLE_PROMPT}`;
  const encoded = encodeURIComponent(combined);
  const seed = Math.floor(Math.random() * 1_000_000);
  return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&enhance=true&seed=${seed}`;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'POST' && url.pathname === '/api/generate') {
    try {
      const body = await readBody(req);
      const userPrompt = (body.prompt || '').trim();
      if (!userPrompt) {
        return sendJSON(res, 400, { error: '프롬프트를 입력해주세요.' });
      }
      const imageUrl = buildImageUrl(userPrompt);
      return sendJSON(res, 200, { imageUrl, userPrompt });
    } catch (e) {
      return sendJSON(res, 500, { error: '서버 오류: ' + e.message });
    }
  }

  // static file serving
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
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
  console.log(`한지 위의 먹그림 서버: http://localhost:${PORT}`);
});
