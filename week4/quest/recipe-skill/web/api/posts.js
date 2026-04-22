import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const ANIMALS = ['고양이','강아지','부엉이','여우','햄스터','판다','토끼','다람쥐','펭귄','코알라'];
const ADJECTIVES = ['지친','뿌듯한','다정한','감성','배고픈','씩씩한','조용한','엉뚱한','따뜻한','귀여운'];
const VALID_CATEGORIES = ['고민','칭찬','응원','수다'];

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
      if (req.query.view === 'best') {
        const bestResult = await pool.query(`
          SELECT
            p.id, p.category, p.content, p.nickname, p.tags,
            p.like_count, p.cheer_count, p.sparkle_count, p.created_at,
            (p.like_count + p.cheer_count + p.sparkle_count) AS total_reactions,
            (SELECT COUNT(*)::int FROM board_comments c WHERE c.post_id = p.id) AS comment_count
          FROM board_posts p
          ORDER BY total_reactions DESC, p.created_at DESC
          LIMIT 5
        `);
        return res.json(bestResult.rows);
      }

      const sort = (req.query.sort === 'popular') ? 'popular' : 'latest';
      const category = req.query.category;
      const sessionId = getSessionId(req);
      const params = [];
      let where = '';
      if (category && category !== '전체' && VALID_CATEGORIES.includes(category)) {
        params.push(category);
        where = ` WHERE p.category = $${params.length}`;
      }
      const orderBy = sort === 'popular'
        ? '(p.like_count + p.cheer_count + p.sparkle_count) DESC, p.created_at DESC'
        : 'p.created_at DESC';

      let myReactionsSelect = `'[]'::json AS my_reactions`;
      if (sessionId) {
        params.push(sessionId);
        myReactionsSelect = `(
          SELECT COALESCE(json_agg(r.reaction_type), '[]'::json)
          FROM board_reactions r
          WHERE r.post_id = p.id AND r.session_id = $${params.length}
        ) AS my_reactions`;
      }

      const sql = `
        SELECT
          p.id, p.category, p.content, p.nickname, p.tags,
          p.like_count, p.cheer_count, p.sparkle_count, p.created_at,
          (SELECT COUNT(*)::int FROM board_comments c WHERE c.post_id = p.id) AS comment_count,
          ${myReactionsSelect}
        FROM board_posts p
        ${where}
        ORDER BY ${orderBy}
        LIMIT 100
      `;
      const result = await pool.query(sql, params);
      return res.json(result.rows);
    }

    if (req.method === 'POST') {
      const { category, content, tags } = req.body || {};
      if (!category || !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: 'invalid category' });
      }
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ error: 'content required' });
      }
      if (content.length > 500) {
        return res.status(400).json({ error: 'content too long (max 500)' });
      }
      const cleanTags = Array.isArray(tags)
        ? tags
            .filter(t => typeof t === 'string' && t.trim().length > 0)
            .slice(0, 5)
            .map(t => t.trim().slice(0, 20))
        : [];
      const nickname = generateNickname();
      const result = await pool.query(
        `INSERT INTO board_posts (category, content, nickname, tags)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [category, content.trim(), nickname, cleanTags]
      );
      const row = result.rows[0];
      row.comment_count = 0;
      row.my_reactions = [];
      return res.status(201).json(row);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[posts]', error);
    return res.status(500).json({ error: error.message });
  }
}
