import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function getSessionId(req) {
  const h = req.headers['x-session-id'];
  if (typeof h === 'string' && h.length > 0 && h.length < 200) return h;
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/honsam_sid=([^;]+)/);
  return m ? m[1] : null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const sessionId = getSessionId(req) || '';
    const result = await pool.query(`
      SELECT
        q.id, q.category, q.title, q.option_a, q.option_b,
        q.emoji_a, q.emoji_b, q.nickname, q.created_at,
        COUNT(CASE WHEN v.choice = 'A' THEN 1 END)::int AS vote_a_count,
        COUNT(CASE WHEN v.choice = 'B' THEN 1 END)::int AS vote_b_count,
        COUNT(v.id)::int AS total_votes,
        MAX(CASE WHEN v.session_id = $1 THEN v.choice END) AS user_choice
      FROM balance_questions q
      LEFT JOIN balance_votes v ON v.question_id = q.id
      GROUP BY q.id
      ORDER BY total_votes DESC, q.created_at DESC
      LIMIT 5
    `, [sessionId]);
    return res.json(result.rows);
  } catch (error) {
    console.error('[balance/ranking]', error);
    return res.status(500).json({ error: error.message });
  }
}
