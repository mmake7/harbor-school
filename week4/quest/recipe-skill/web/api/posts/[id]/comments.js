import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const ANIMALS = ['고양이','강아지','부엉이','여우','햄스터','판다','토끼','다람쥐','펭귄','코알라'];
const ADJECTIVES = ['지친','뿌듯한','다정한','감성','배고픈','씩씩한','조용한','엉뚱한','따뜻한','귀여운'];

function generateNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 9999) + 1;
  return `${adj} ${animal} #${num}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const postId = parseInt(req.query.id, 10);
  if (!Number.isFinite(postId) || postId <= 0) {
    return res.status(400).json({ error: 'invalid post id' });
  }

  try {
    if (req.method === 'GET') {
      const result = await pool.query(
        `SELECT id, post_id, content, nickname, created_at
         FROM board_comments
         WHERE post_id = $1
         ORDER BY created_at ASC`,
        [postId]
      );
      return res.json(result.rows);
    }

    if (req.method === 'POST') {
      const { content } = req.body || {};
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ error: 'content required' });
      }
      if (content.length > 300) {
        return res.status(400).json({ error: 'content too long (max 300)' });
      }
      const exists = await pool.query('SELECT 1 FROM board_posts WHERE id = $1', [postId]);
      if (exists.rows.length === 0) {
        return res.status(404).json({ error: 'post not found' });
      }
      const nickname = generateNickname();
      const result = await pool.query(
        `INSERT INTO board_comments (post_id, content, nickname)
         VALUES ($1, $2, $3) RETURNING *`,
        [postId, content.trim(), nickname]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[comments]', error);
    return res.status(500).json({ error: error.message });
  }
}
