import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const VALID_TYPES = ['like', 'cheer', 'sparkle'];
const COUNT_COLUMN = {
  like: 'like_count',
  cheer: 'cheer_count',
  sparkle: 'sparkle_count',
};

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
  if (!sessionId) {
    return res.status(400).json({ error: 'session id required (x-session-id header)' });
  }

  const { post_id, reaction_type } = req.body || {};
  const postId = parseInt(post_id, 10);
  if (!Number.isFinite(postId) || postId <= 0) {
    return res.status(400).json({ error: 'invalid post_id' });
  }
  if (!VALID_TYPES.includes(reaction_type)) {
    return res.status(400).json({ error: 'invalid reaction_type' });
  }
  const col = COUNT_COLUMN[reaction_type];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query(
      `SELECT id FROM board_reactions
       WHERE post_id = $1 AND reaction_type = $2 AND session_id = $3`,
      [postId, reaction_type, sessionId]
    );

    let state;
    if (existing.rows.length > 0) {
      await client.query(
        `DELETE FROM board_reactions
         WHERE post_id = $1 AND reaction_type = $2 AND session_id = $3`,
        [postId, reaction_type, sessionId]
      );
      await client.query(
        `UPDATE board_posts SET ${col} = GREATEST(${col} - 1, 0) WHERE id = $1`,
        [postId]
      );
      state = 'removed';
    } else {
      await client.query(
        `INSERT INTO board_reactions (post_id, reaction_type, session_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (post_id, reaction_type, session_id) DO NOTHING`,
        [postId, reaction_type, sessionId]
      );
      await client.query(
        `UPDATE board_posts SET ${col} = ${col} + 1 WHERE id = $1`,
        [postId]
      );
      state = 'added';
    }

    const result = await client.query(
      `SELECT id, like_count, cheer_count, sparkle_count FROM board_posts WHERE id = $1`,
      [postId]
    );

    await client.query('COMMIT');

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'post not found' });
    }
    return res.json({ state, post: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[reactions]', error);
    return res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}
