const http = require('http');
const https = require('https');
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

function proxyImage(res, targetUrl) {
  const doGet = (urlStr, redirectsLeft) => {
    https.get(urlStr, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HanjiInkServer/1.0)',
        'Accept': 'image/*',
      },
    }, (upstream) => {
      if ([301, 302, 307, 308].includes(upstream.statusCode) && upstream.headers.location && redirectsLeft > 0) {
        upstream.resume();
        return doGet(upstream.headers.location, redirectsLeft - 1);
      }
      if (upstream.statusCode !== 200) {
        res.writeHead(upstream.statusCode || 502, { 'Content-Type': 'text/plain; charset=utf-8' });
        upstream.resume();
        return res.end(`상류 서버 오류: ${upstream.statusCode}`);
      }
      res.writeHead(200, {
        'Content-Type': upstream.headers['content-type'] || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      });
      upstream.pipe(res);
    }).on('error', (err) => {
      console.error('[프록시 오류]', err);
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
      }
      res.end('이미지 프록시 실패');
    });
  };
  doGet(targetUrl, 5);
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
      const pollinationsUrl = buildImageUrl(userPrompt);
      const imageUrl = `/api/image?url=${encodeURIComponent(pollinationsUrl)}`;
      console.log('\n─────────────────────────────────────');
      console.log(`[${new Date().toISOString()}] /api/generate`);
      console.log(`  사용자 프롬프트: ${userPrompt}`);
      console.log(`  Pollinations URL (직접 브라우저로 확인 가능):`);
      console.log(`  ${pollinationsUrl}`);
      console.log('─────────────────────────────────────');
      return sendJSON(res, 200, { imageUrl, pollinationsUrl, userPrompt });
    } catch (e) {
      console.error('[/api/generate 오류]', e);
      return sendJSON(res, 500, { error: '서버 오류: ' + e.message });
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/image') {
    const target = url.searchParams.get('url');
    if (!target || !/^https:\/\/image\.pollinations\.ai\//.test(target)) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('허용되지 않은 이미지 URL');
    }
    return proxyImage(res, target);
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
