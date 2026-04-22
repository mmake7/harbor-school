import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function getSessionId(req) {
  const h = req.headers['x-session-id'];
  if (typeof h === 'string' && h.length > 0 && h.length < 200) return h;
  const q = req.query && req.query.session_id;
  if (typeof q === 'string' && q.length > 0 && q.length < 200) return q;
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/honsam_sid=([^;]+)/);
  return m ? m[1] : null;
}

function formatDate(d) {
  if (typeof d === 'string') return d.slice(0, 10);
  if (d instanceof Date) return d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
  return String(d);
}

function rowToItem(row) {
  return {
    fortune_date: formatDate(row.fortune_date),
    overall_score: row.overall_score,
    overall_message: row.overall_message,
    themes: {
      honbap: { score: row.honbap_score, text: row.honbap_text },
      jachi:  { score: row.jachi_score,  text: row.jachi_text },
      save:   { score: row.save_score,   text: row.save_text },
      meet:   { score: row.meet_score,   text: row.meet_text },
    },
    lucky_item: row.lucky_item,
    daily_advice: row.daily_advice,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sessionId = getSessionId(req);
  if (!sessionId) return res.status(400).json({ error: 'session id required' });

  try {
    const result = await pool.query(
      `SELECT * FROM fortune_daily
       WHERE session_id = $1
       ORDER BY fortune_date DESC
       LIMIT 7`,
      [sessionId]
    );
    return res.json({
      items: result.rows.map(rowToItem),
    });
  } catch (error) {
    console.error('[fortune/history]', error);
    return res.status(500).json({
      error: '운세 기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
    });
  }
}
