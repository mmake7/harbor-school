// Minimal zero-dependency Pokemon server
// Run: node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// In-memory Pokemon data store
// ---------------------------------------------------------------------------
const spriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const pokemons = [
  {
    id: 1,
    name: '이상해씨',
    englishName: 'Bulbasaur',
    types: ['grass', 'poison'],
    sprite: spriteUrl(1),
    description:
      '태어날 때부터 등에 식물의 씨앗이 있으며, 자라면서 함께 성장한다.',
  },
  {
    id: 7,
    name: '꼬부기',
    englishName: 'Squirtle',
    types: ['water'],
    sprite: spriteUrl(7),
    description:
      '단단한 등껍질로 몸을 보호하며, 입에서 강한 물줄기를 발사한다.',
  },
  {
    id: 25,
    name: '피카츄',
    englishName: 'Pikachu',
    types: ['electric'],
    sprite: spriteUrl(25),
    description:
      '볼에 있는 전기 주머니에 전기를 모았다가 강력한 전격으로 방출한다.',
  },
  {
    id: 6,
    name: '리자몽',
    englishName: 'Charizard',
    types: ['fire', 'flying'],
    sprite: spriteUrl(6),
    description:
      '하늘을 날아다니며 강한 상대를 찾는다. 입에서 뜨거운 불꽃을 내뿜는다.',
  },
  {
    id: 150,
    name: '뮤츠',
    englishName: 'Mewtwo',
    types: ['psychic'],
    sprite: spriteUrl(150),
    description:
      '유전자 조작으로 탄생한 전설의 포켓몬. 가장 흉포한 마음을 지녔다고 전해진다.',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function sendJSON(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function sendNotFound(res, message = 'Not Found') {
  sendJSON(res, 404, { success: false, message });
}

function serveIndexHtml(res) {
  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJSON(res, 500, {
        success: false,
        message: 'Failed to read index.html',
      });
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': data.length,
    });
    res.end(data);
  });
}

// ---------------------------------------------------------------------------
// Request handler
// ---------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  if (req.method !== 'GET') {
    sendJSON(res, 405, { success: false, message: 'Method Not Allowed' });
    return;
  }

  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname || '/';

  // Static: index.html
  if (pathname === '/' || pathname === '/index.html') {
    serveIndexHtml(res);
    return;
  }

  // API: search (must be checked before /:id)
  if (pathname === '/api/pokemons/search') {
    const q = (parsed.query.q || '').toString().trim().toLowerCase();
    if (!q) {
      sendJSON(res, 200, { success: true, data: pokemons });
      return;
    }
    const filtered = pokemons.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.englishName.toLowerCase().includes(q)
    );
    sendJSON(res, 200, { success: true, data: filtered });
    return;
  }

  // API: list all
  if (pathname === '/api/pokemons') {
    sendJSON(res, 200, { success: true, data: pokemons });
    return;
  }

  // API: get one by id
  const idMatch = pathname.match(/^\/api\/pokemons\/(\d+)$/);
  if (idMatch) {
    const id = Number(idMatch[1]);
    const found = pokemons.find((p) => p.id === id);
    if (!found) {
      sendNotFound(res, `Pokemon with id ${id} not found`);
      return;
    }
    sendJSON(res, 200, { success: true, data: found });
    return;
  }

  // Fallback 404
  sendNotFound(res, `Route ${pathname} not found`);
});

server.listen(PORT, () => {
  console.log(`Pokemon server running at http://localhost:${PORT}`);
});
