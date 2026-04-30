// ===========================================================
// 로컬 개발 서버 — Vercel-like routing
//   $ node dev-server.js
//   GET/POST/PATCH/DELETE /api/budget?view=...
// ===========================================================
require('dotenv').config({ path: __dirname + '/.env.local' });
const express = require('express');
const path = require('path');
const handler = require('./api/budget.js');

const app = express();
app.use(express.json({ limit: '64kb' }));

// 정적 파일 (Step C 화면 준비)
app.use(express.static(path.join(__dirname, 'public')));

// /api/budget — 모든 메서드 위임
app.all('/api/budget', (req, res) => handler(req, res));

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
