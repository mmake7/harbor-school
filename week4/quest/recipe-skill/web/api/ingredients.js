import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT * FROM fridge_ingredients ORDER BY expiry ASC'
      );
      return res.json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, quantity, category, expiry, allergen } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'name is required' });
      }
      const result = await pool.query(
        `INSERT INTO fridge_ingredients (name, quantity, category, expiry, allergen)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, quantity, category || '냉장', expiry, allergen || false]
      );
      return res.status(201).json(result.rows[0]);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, quantity, category, expiry, allergen } = req.body;
      const result = await pool.query(
        `UPDATE fridge_ingredients
         SET name=$1, quantity=$2, category=$3, expiry=$4, allergen=$5
         WHERE id=$6 RETURNING *`,
        [name, quantity, category, expiry, allergen, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'not found' });
      }
      return res.json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await pool.query('DELETE FROM fridge_ingredients WHERE id=$1', [id]);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[ingredients]', error);
    return res.status(500).json({ error: error.message });
  }
}
