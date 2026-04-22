import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const VALID_AGE = ['20대','30대','40대','50대+'];
const VALID_JOB = ['IT','금융','공공','서비스','제조','기타'];

function getSessionId(req) {
  const h = req.headers['x-session-id'];
  if (typeof h === 'string' && h.length > 0 && h.length < 200) return h;
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/honsam_sid=([^;]+)/);
  return m ? m[1] : null;
}

const BUCKETS = [
  { label: '<200', min: 0,   max: 200 },
  { label: '200-300', min: 200, max: 300 },
  { label: '300-400', min: 300, max: 400 },
  { label: '400-500', min: 400, max: 500 },
  { label: '500+', min: 500, max: null },
];

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sessionId = getSessionId(req) || '';
  const job = req.query.job && VALID_JOB.includes(req.query.job) ? req.query.job : null;
  const age = req.query.age && VALID_AGE.includes(req.query.age) ? req.query.age : null;

  const where = [];
  const params = [];
  if (job) { params.push(job); where.push(`job_category = $${params.length}`); }
  if (age) { params.push(age); where.push(`age_group = $${params.length}`); }
  const whereSql = where.length ? ('WHERE ' + where.join(' AND ')) : '';

  try {
    const statsSql = `
      SELECT
        COUNT(*)::int AS total_count,
        COALESCE(AVG(monthly_salary), 0)::int AS salary_avg,
        COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY monthly_salary), 0)::int AS salary_median,
        COALESCE(MIN(monthly_salary), 0)::int AS salary_min,
        COALESCE(MAX(monthly_salary), 0)::int AS salary_max,
        COALESCE(AVG(expense_housing), 0)::int       AS exp_housing_avg,
        COALESCE(AVG(expense_food), 0)::int          AS exp_food_avg,
        COALESCE(AVG(expense_transport), 0)::int     AS exp_transport_avg,
        COALESCE(AVG(expense_telecom), 0)::int       AS exp_telecom_avg,
        COALESCE(AVG(expense_subscription), 0)::int  AS exp_subscription_avg,
        COALESCE(AVG(expense_shopping), 0)::int      AS exp_shopping_avg,
        COALESCE(AVG(expense_pet), 0)::int           AS exp_pet_avg,
        COALESCE(AVG(expense_leisure), 0)::int       AS exp_leisure_avg,
        COALESCE(AVG(expense_pet) FILTER (WHERE expense_pet > 0), 0)::int AS exp_pet_owners_avg,
        COUNT(*) FILTER (WHERE expense_pet > 0)::int AS pet_owners_count,
        COALESCE(AVG(
          CASE WHEN monthly_salary > 0 THEN
            (monthly_salary - (expense_housing + expense_food + expense_transport
              + expense_telecom + expense_subscription
              + expense_shopping + expense_pet + expense_leisure))::numeric
            / monthly_salary
          END
        ), 0)::float AS savings_rate_avg,
        COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY
          CASE WHEN monthly_salary > 0 THEN
            (monthly_salary - (expense_housing + expense_food + expense_transport
              + expense_telecom + expense_subscription
              + expense_shopping + expense_pet + expense_leisure))::numeric
            / monthly_salary
          END
        ), 0)::float AS savings_rate_median
      FROM life_profiles
      ${whereSql}
    `;

    const distSql = `
      SELECT
        COUNT(*) FILTER (WHERE monthly_salary < 200)::int AS b1,
        COUNT(*) FILTER (WHERE monthly_salary >= 200 AND monthly_salary < 300)::int AS b2,
        COUNT(*) FILTER (WHERE monthly_salary >= 300 AND monthly_salary < 400)::int AS b3,
        COUNT(*) FILTER (WHERE monthly_salary >= 400 AND monthly_salary < 500)::int AS b4,
        COUNT(*) FILTER (WHERE monthly_salary >= 500)::int AS b5
      FROM life_profiles
      ${whereSql}
    `;

    const byJobSql = `
      SELECT job_category,
        COUNT(*)::int AS count,
        COALESCE(AVG(monthly_salary), 0)::int AS salary_avg
      FROM life_profiles
      ${whereSql}
      GROUP BY job_category
      ORDER BY salary_avg DESC
    `;

    const byAgeSql = `
      SELECT age_group,
        COUNT(*)::int AS count,
        COALESCE(AVG(monthly_salary), 0)::int AS salary_avg
      FROM life_profiles
      ${whereSql}
      GROUP BY age_group
      ORDER BY
        CASE age_group
          WHEN '20대' THEN 1 WHEN '30대' THEN 2 WHEN '40대' THEN 3 WHEN '50대+' THEN 4 ELSE 5
        END
    `;

    const meSql = `SELECT * FROM life_profiles WHERE session_id = $1 LIMIT 1`;

    const [statsR, distR, byJobR, byAgeR, meR] = await Promise.all([
      pool.query(statsSql, params),
      pool.query(distSql, params),
      pool.query(byJobSql, params),
      pool.query(byAgeSql, params),
      pool.query(meSql, [sessionId]),
    ]);

    const stats = statsR.rows[0];
    const dist = distR.rows[0];
    const distribution = BUCKETS.map((b, i) => ({ label: b.label, count: dist[`b${i + 1}`] }));

    const total_exp_avg =
      stats.exp_housing_avg + stats.exp_food_avg + stats.exp_transport_avg +
      stats.exp_telecom_avg + stats.exp_subscription_avg +
      stats.exp_shopping_avg + stats.exp_pet_avg + stats.exp_leisure_avg;

    const expense_breakdown = [
      { key: 'housing',      icon: '🏠', label: '주거',      avg: stats.exp_housing_avg },
      { key: 'food',         icon: '🍽️', label: '식비',      avg: stats.exp_food_avg },
      { key: 'transport',    icon: '🚗', label: '교통',      avg: stats.exp_transport_avg },
      { key: 'telecom',      icon: '📱', label: '통신비',    avg: stats.exp_telecom_avg },
      { key: 'subscription', icon: '📺', label: '구독료',    avg: stats.exp_subscription_avg },
      { key: 'shopping',     icon: '👔', label: '쇼핑',      avg: stats.exp_shopping_avg },
      { key: 'pet',          icon: '🐾', label: '반려동물',  avg: stats.exp_pet_avg },
      { key: 'leisure',      icon: '🎮', label: '여가',      avg: stats.exp_leisure_avg },
    ].map(x => ({
      ...x,
      percent: total_exp_avg > 0 ? Math.round((x.avg / total_exp_avg) * 100) : 0,
    }));

    const pet_stats = {
      avg_all: stats.exp_pet_avg,
      avg_owners: stats.exp_pet_owners_avg,
      pet_owners_count: stats.pet_owners_count,
    };

    let my_position = null;
    const me = meR.rows[0];
    if (me) {
      const mySalary = num(me.monthly_salary);
      const myExp = num(me.expense_housing) + num(me.expense_food) + num(me.expense_transport)
                  + num(me.expense_telecom) + num(me.expense_subscription)
                  + num(me.expense_shopping) + num(me.expense_pet) + num(me.expense_leisure);
      const mySavingsRate = mySalary > 0 ? (mySalary - myExp) / mySalary : 0;
      const myHousingRatio = mySalary > 0 ? num(me.expense_housing) / mySalary : 0;

      const rankR = await pool.query(
        `SELECT
           COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE monthly_salary < $${params.length + 1})::int AS below
         FROM life_profiles
         ${whereSql}`,
        [...params, mySalary]
      );
      const total = rankR.rows[0].total;
      const below = rankR.rows[0].below;
      const salary_percentile = total > 0 ? Math.round((below / total) * 100) : 0;
      const rank_from_top = total > 0 ? (total - below) : 0;

      my_position = {
        monthly_salary: mySalary,
        salary_percentile,
        rank_from_top,
        total_in_group: total,
        savings_rate: mySavingsRate,
        housing_ratio: myHousingRatio,
        housing_warning: myHousingRatio >= 0.3,
        age_group: me.age_group,
        job_category: me.job_category,
        region: me.region,
        experience_years: me.experience_years,
      };
    }

    return res.json({
      filter: { job, age },
      total_count: stats.total_count,
      salary: {
        avg: stats.salary_avg,
        median: stats.salary_median,
        min: stats.salary_min,
        max: stats.salary_max,
      },
      distribution,
      expense_breakdown,
      pet_stats,
      savings: {
        avg_rate: stats.savings_rate_avg,
        median_rate: stats.savings_rate_median,
      },
      by_job: byJobR.rows,
      by_age: byAgeR.rows,
      my_position,
    });
  } catch (error) {
    console.error('[life/stats]', error);
    return res.status(500).json({ error: error.message });
  }
}
