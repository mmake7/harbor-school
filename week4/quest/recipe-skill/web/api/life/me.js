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

  const sessionId = getSessionId(req);
  if (!sessionId) return res.json(null);

  try {
    const result = await pool.query(
      'SELECT * FROM life_profiles WHERE session_id = $1 LIMIT 1',
      [sessionId]
    );
    return res.json(result.rows[0] || null);
  } catch (error) {
    console.error('[life/me]', error);
    return res.status(500).json({ error: error.message });
  }
}
