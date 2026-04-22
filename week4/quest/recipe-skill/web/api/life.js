import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const VALID_AGE = ['20대','30대','40대','50대+'];
const VALID_JOB = ['IT','금융','공공','서비스','제조','기타'];
const VALID_EXP = ['1년미만','1-3년','3-5년','5-10년','10년+'];
const VALID_REGION = ['수도권','광역시','그외'];

function getSessionId(req) {
  const h = req.headers['x-session-id'];
  if (typeof h === 'string' && h.length > 0 && h.length < 200) return h;
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/honsam_sid=([^;]+)/);
  return m ? m[1] : null;
}

function toInt(v) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sessionId = getSessionId(req);
  if (!sessionId) return res.status(400).json({ error: 'session id required' });

  const b = req.body || {};
  const age_group = b.age_group;
  const job_category = b.job_category;
  const experience_years = b.experience_years;
  const region = b.region;
  const salary = toInt(b.monthly_salary);
  const ex_housing = toInt(b.expense_housing) ?? 0;
  const ex_food = toInt(b.expense_food) ?? 0;
  const ex_transport = toInt(b.expense_transport) ?? 0;
  const ex_leisure = toInt(b.expense_leisure) ?? 0;
  const ex_shopping = toInt(b.expense_shopping) ?? 0;
  const ex_other = toInt(b.expense_other) ?? 0;

  if (!VALID_AGE.includes(age_group)) return res.status(400).json({ error: 'invalid age_group' });
  if (!VALID_JOB.includes(job_category)) return res.status(400).json({ error: 'invalid job_category' });
  if (!VALID_EXP.includes(experience_years)) return res.status(400).json({ error: 'invalid experience_years' });
  if (!VALID_REGION.includes(region)) return res.status(400).json({ error: 'invalid region' });
  if (!salary || salary <= 0) return res.status(400).json({ error: 'invalid monthly_salary' });
  for (const v of [ex_housing, ex_food, ex_transport, ex_leisure, ex_shopping, ex_other]) {
    if (v < 0) return res.status(400).json({ error: 'expense must be >= 0' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM life_profiles WHERE session_id = $1 LIMIT 1',
      [sessionId]
    );

    let row;
    if (existing.rows.length > 0) {
      const result = await pool.query(
        `UPDATE life_profiles SET
           age_group = $1, job_category = $2, experience_years = $3, region = $4,
           monthly_salary = $5,
           expense_housing = $6, expense_food = $7, expense_transport = $8,
           expense_leisure = $9, expense_shopping = $10, expense_other = $11
         WHERE session_id = $12
         RETURNING *`,
        [age_group, job_category, experience_years, region, salary,
         ex_housing, ex_food, ex_transport, ex_leisure, ex_shopping, ex_other,
         sessionId]
      );
      row = result.rows[0];
    } else {
      const result = await pool.query(
        `INSERT INTO life_profiles
           (age_group, job_category, experience_years, region, monthly_salary,
            expense_housing, expense_food, expense_transport,
            expense_leisure, expense_shopping, expense_other, session_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         RETURNING *`,
        [age_group, job_category, experience_years, region, salary,
         ex_housing, ex_food, ex_transport, ex_leisure, ex_shopping, ex_other,
         sessionId]
      );
      row = result.rows[0];
    }
    return res.status(200).json(row);
  } catch (error) {
    console.error('[life]', error);
    return res.status(500).json({ error: error.message });
  }
}
