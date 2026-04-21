import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const [k, ...v] = t.split('=');
    process.env[k.trim()] = v.join('=').trim();
  }
  console.log('✅ .env.local loaded');
} catch {
  console.warn('⚠️  .env.local not found');
}

const PORT = Number(process.env.PORT) || 3000;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const API_ROUTES = {
  '/api/ingredients': './api/ingredients.js',
  '/api/recipe':      './api/recipe.js',
};

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      if (!data) return resolve(null);
      try { resolve(JSON.parse(data)); } catch { resolve(data); }
    });
  });
}

function patchRes(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (body) => {
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
    return res;
  };
  return res;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const t0 = Date.now();
  try {
    if (API_ROUTES[url.pathname]) {
      const mod = await import(API_ROUTES[url.pathname]);
      req.body = await readBody(req);
      req.query = Object.fromEntries(url.searchParams);
      patchRes(res);
      await mod.default(req, res);
      console.log(`${req.method} ${url.pathname} → ${res.statusCode} (${Date.now()-t0}ms)`);
      return;
    }
    let rel = url.pathname === '/' ? '/index.html' : url.pathname;
    const filePath = path.join(__dirname, 'public', rel);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.setHeader('Content-Type', MIME[path.extname(filePath)] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  } catch (e) {
    console.error('[server error]', e);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: e.message, stack: e.stack }));
    }
  }
});

server.listen(PORT, () => {
  console.log(`\n🏠 혼삶 웹 로컬 서버 http://localhost:${PORT}`);
  console.log(`   • GET/POST/PUT/DELETE  /api/ingredients`);
  console.log(`   • GET/POST              /api/recipe`);
  console.log(`   • 정적파일              /  (public/index.html)\n`);
});
