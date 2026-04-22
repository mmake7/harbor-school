import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const VALID_CHOICES = ['A', 'B'];

function getSessionId(req) {
  const h = req.headers['x-session-id'];
  if (typeof h === 'string' && h.length > 0 && h.length < 200) return h;
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/honsam_sid=([^;]+)/);
  return m ? m[1] : null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sessionId = getSessionId(req);
  if (!sessionId) return res.status(400).json({ error: 'session id required' });

  const { question_id, choice } = req.body || {};
  const qid = parseInt(question_id, 10);
  if (!Number.isFinite(qid) || qid <= 0) return res.status(400).json({ error: 'invalid question_id' });
  if (!VALID_CHOICES.includes(choice)) return res.status(400).json({ error: 'invalid choice' });

  try {
    const exists = await pool.query('SELECT 1 FROM balance_questions WHERE id = $1', [qid]);
    if (exists.rows.length === 0) return res.status(404).json({ error: 'question not found' });

    await pool.query(
      `INSERT INTO balance_votes (question_id, choice, session_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (question_id, session_id)
       DO UPDATE SET choice = EXCLUDED.choice, created_at = NOW()`,
      [qid, choice, sessionId]
    );

    const result = await pool.query(`
      SELECT
        q.id,
        COUNT(CASE WHEN v.choice = 'A' THEN 1 END)::int AS vote_a_count,
        COUNT(CASE WHEN v.choice = 'B' THEN 1 END)::int AS vote_b_count,
        COUNT(v.id)::int AS total_votes,
        MAX(CASE WHEN v.session_id = $2 THEN v.choice END) AS user_choice
      FROM balance_questions q
      LEFT JOIN balance_votes v ON v.question_id = q.id
      WHERE q.id = $1
      GROUP BY q.id
    `, [qid, sessionId]);

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('[vote]', error);
    return res.status(500).json({ error: error.message });
  }
}
