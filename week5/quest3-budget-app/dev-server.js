// ===========================================================
// 로컬 개발 서버 — Vercel-like routing
//   $ node dev-server.js
//   GET/POST/PATCH/DELETE /api/budget?view=...
//   GET/POST              /api/analyze?view=...   (Q4 통합)
// ===========================================================
require('dotenv').config({ path: __dirname + '/.env.local' });
const express = require('express');
const path = require('path');
const budgetHandler  = require('./api/budget.js');
const analyzeHandler = require('./api/analyze.js');

const app = express();
app.use(express.json({ limit: '256kb' }));

// 정적 파일
app.use(express.static(path.join(__dirname, 'public')));

// API
app.all('/api/budget',  (req, res) => budgetHandler(req, res));
app.all('/api/analyze', (req, res) => analyzeHandler(req, res));

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
