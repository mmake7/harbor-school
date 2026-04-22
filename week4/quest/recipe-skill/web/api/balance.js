import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const ANIMALS = ['고양이','강아지','부엉이','여우','햄스터','판다','토끼','다람쥐','펭귄','코알라'];
const ADJECTIVES = ['지친','뿌듯한','다정한','감성','배고픈','씩씩한','조용한','엉뚱한','따뜻한','귀여운'];
const VALID_CATEGORIES = ['돈','음식','주거','일','여가'];

function generateNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 9999) + 1;
  return `${adj} ${animal} #${num}`;
}

function getSessionId(req) {
  const h = req.headers['x-session-id'];
  if (typeof h === 'string' && h.length > 0 && h.length < 200) return h;
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/honsam_sid=([^;]+)/);
  return m ? m[1] : null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const sort = (req.query.sort === 'popular') ? 'popular' : 'latest';
      const category = req.query.category;
      const sessionId = getSessionId(req) || '';

      const params = [sessionId];
      let where = '';
      if (category && category !== '전체' && VALID_CATEGORIES.includes(category)) {
        params.push(category);
        where = `WHERE q.category = $${params.length}`;
      }

      const orderBy = sort === 'popular'
        ? 'total_votes DESC, q.created_at DESC'
        : 'q.created_at DESC';

      const sql = `
        SELECT
          q.id, q.category, q.title, q.option_a, q.option_b,
          q.emoji_a, q.emoji_b, q.nickname, q.created_at,
          COUNT(CASE WHEN v.choice = 'A' THEN 1 END)::int AS vote_a_count,
          COUNT(CASE WHEN v.choice = 'B' THEN 1 END)::int AS vote_b_count,
          COUNT(v.id)::int AS total_votes,
          MAX(CASE WHEN v.session_id = $1 THEN v.choice END) AS user_choice
        FROM balance_questions q
        LEFT JOIN balance_votes v ON v.question_id = q.id
        ${where}
        GROUP BY q.id
        ORDER BY ${orderBy}
        LIMIT 100
      `;
      const result = await pool.query(sql, params);
      return res.json(result.rows);
    }

    if (req.method === 'POST') {
      const { category, title, option_a, option_b, emoji_a, emoji_b } = req.body || {};
      if (!category || !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: 'invalid category' });
      }
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'title required' });
      }
      if (title.length > 50) {
        return res.status(400).json({ error: 'title too long (max 50)' });
      }
      if (!option_a || typeof option_a !== 'string' || option_a.trim().length === 0) {
        return res.status(400).json({ error: 'option_a required' });
      }
      if (!option_b || typeof option_b !== 'string' || option_b.trim().length === 0) {
        return res.status(400).json({ error: 'option_b required' });
      }
      if (option_a.length > 30 || option_b.length > 30) {
        return res.status(400).json({ error: 'option too long (max 30)' });
      }

      const nickname = generateNickname();
      const a = option_a.trim();
      const b = option_b.trim();
      const ea = typeof emoji_a === 'string' && emoji_a.trim().length > 0 ? emoji_a.trim().slice(0, 8) : null;
      const eb = typeof emoji_b === 'string' && emoji_b.trim().length > 0 ? emoji_b.trim().slice(0, 8) : null;

      const cols = ['category','title','option_a','option_b'];
      const vals = [category, title.trim(), a, b];
      if (ea !== null) { cols.push('emoji_a'); vals.push(ea); }
      if (eb !== null) { cols.push('emoji_b'); vals.push(eb); }
      cols.push('nickname'); vals.push(nickname);

      const placeholders = cols.map((_, i) => '$' + (i + 1)).join(', ');
      const sql = `INSERT INTO balance_questions (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *`;

      const result = await pool.query(sql, vals);
      const row = result.rows[0];
      row.vote_a_count = 0;
      row.vote_b_count = 0;
      row.total_votes = 0;
      row.user_choice = null;
      return res.status(201).json(row);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[balance]', error);
    return res.status(500).json({ error: error.message });
  }
}
