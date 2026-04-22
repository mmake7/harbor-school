import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const result = await pool.query(`
      SELECT
        p.id, p.category, p.content, p.nickname, p.tags,
        p.like_count, p.cheer_count, p.sparkle_count, p.created_at,
        (p.like_count + p.cheer_count + p.sparkle_count) AS total_reactions,
        (SELECT COUNT(*)::int FROM board_comments c WHERE c.post_id = p.id) AS comment_count
      FROM board_posts p
      ORDER BY total_reactions DESC, p.created_at DESC
      LIMIT 5
    `);
    return res.json(result.rows);
  } catch (error) {
    console.error('[posts/best]', error);
    return res.status(500).json({ error: error.message });
  }
}
