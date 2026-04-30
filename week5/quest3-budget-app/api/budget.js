// ===========================================================
// /api/budget — Vercel serverless function
//   ?view= 분기 라우팅 (5주차 컨벤션)
//   - GET  ?view=categories
//   - GET  ?view=entries[&month=YYYY-MM]
//   - POST ?view=entries  body: { entry_date, type, category_id, amount, memo }
//   - PATCH ?view=entries&id=...
//   - DELETE ?view=entries&id=...
//   - GET  ?view=stats
//   - GET  ?view=budget-vs-actual
//
// 시간대: 응답에 timezone: "Asia/Seoul" 명시. lib/datetime 으로 KST 일관 처리.
// ===========================================================
const { Pool } = require('pg');
const {
  kstThisMonth, kstMonthStart, kstMonthEnd, kstMonthMinus,
} = require('../lib/datetime');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

const TZ = 'Asia/Seoul';
const TYPES = new Set(['expense', 'income']);

// ---------- helpers ----------
function err(status, msg, detail) {
  return { status, body: detail ? { error: msg, detail } : { error: msg } };
}
function ok(body, status = 200) {
  return { status, body };
}
function isYmd(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s); }
function isYm(s)  { return typeof s === 'string' && /^\d{4}-\d{2}$/.test(s); }

// ---------- handlers ----------
async function categoriesGet() {
  const { rows } = await pool.query(
    `select id, type, code, name, display_order
       from app.budget_categories
      order by type, display_order`
  );
  const expense = [], income = [];
  for (const r of rows) (r.type === 'expense' ? expense : income).push(r);
  return ok({ timezone: TZ, expense, income });
}

async function entriesGet(monthQ) {
  const m = isYm(monthQ) ? monthQ : kstThisMonth();
  const start = kstMonthStart(m), end = kstMonthEnd(m);
  const { rows } = await pool.query(
    `select e.id, e.type, e.amount,
            to_char(e.entry_date, 'YYYY-MM-DD') as entry_date,
            e.memo, e.category_id,
            c.code as category_code, c.name as category_name
       from app.entries e
       join app.budget_categories c on c.id = e.category_id
      where e.entry_date between $1 and $2
      order by e.entry_date desc, e.created_at desc`,
    [start, end]
  );
  return ok({ timezone: TZ, month: m, count: rows.length, items: rows });
}

async function entriesPost(body) {
  const { entry_date, type, category_id, amount, memo } = body || {};
  if (!isYmd(entry_date))    return err(400, 'entry_date 형식 YYYY-MM-DD');
  if (!TYPES.has(type))      return err(400, 'type 은 expense | income');
  if (!category_id)          return err(400, 'category_id 필수');
  const amt = Number(amount);
  if (!Number.isInteger(amt) || amt <= 0) return err(400, 'amount 양의 정수 KRW');
  if (memo != null && (typeof memo !== 'string' || memo.length > 200))
    return err(400, 'memo 200자 이내');

  // type ↔ category 정합성 확인
  const cat = await pool.query(
    'select type, name from app.budget_categories where id = $1', [category_id]
  );
  if (!cat.rows.length)        return err(400, 'category_id 존재 안 함');
  if (cat.rows[0].type !== type)
    return err(400, `category type(${cat.rows[0].type}) ≠ 입력 type(${type})`);

  const { rows } = await pool.query(
    `insert into app.entries (type, category_id, amount, entry_date, memo)
     values ($1, $2, $3, $4, $5)
     returning id, type, amount,
               to_char(entry_date, 'YYYY-MM-DD') as entry_date,
               memo, category_id, created_at`,
    [type, category_id, amt, entry_date, memo || null]
  );
  return ok({ timezone: TZ, item: rows[0] }, 201);
}

async function entriesPatch(id, body) {
  if (!id) return err(400, 'id 필수 (?id=...)');
  const { entry_date, type, category_id, amount, memo } = body || {};
  const f = [], v = [];
  let i = 1;
  if (entry_date !== undefined) {
    if (!isYmd(entry_date)) return err(400, 'entry_date 형식 YYYY-MM-DD');
    f.push(`entry_date = $${i++}`); v.push(entry_date);
  }
  if (type !== undefined) {
    if (!TYPES.has(type)) return err(400, 'type 은 expense | income');
    f.push(`type = $${i++}`); v.push(type);
  }
  if (category_id !== undefined) { f.push(`category_id = $${i++}`); v.push(category_id); }
  if (amount !== undefined) {
    const amt = Number(amount);
    if (!Number.isInteger(amt) || amt <= 0) return err(400, 'amount 양의 정수');
    f.push(`amount = $${i++}`); v.push(amt);
  }
  if (memo !== undefined) { f.push(`memo = $${i++}`); v.push(memo); }
  if (!f.length) return err(400, '변경 필드 없음');
  v.push(id);
  const { rows } = await pool.query(
    `update app.entries set ${f.join(', ')}
      where id = $${i}
      returning id, type, amount,
                to_char(entry_date, 'YYYY-MM-DD') as entry_date,
                memo, category_id, updated_at`,
    v
  );
  if (!rows.length) return err(404, '해당 id 없음');
  return ok({ timezone: TZ, item: rows[0] });
}

async function entriesDelete(id) {
  if (!id) return err(400, 'id 필수 (?id=...)');
  const { rowCount } = await pool.query('delete from app.entries where id = $1', [id]);
  if (!rowCount) return err(404, '해당 id 없음');
  return { status: 204, body: null };
}

async function statsGet() {
  const m = kstThisMonth();
  const start = kstMonthStart(m), end = kstMonthEnd(m);

  const totalsRes = await pool.query(
    `select type, coalesce(sum(amount),0)::int as total, count(*)::int as cnt
       from app.entries
      where entry_date between $1 and $2
      group by type`,
    [start, end]
  );
  const totals = { expense: 0, income: 0 };
  const counts = { expense: 0, income: 0 };
  for (const r of totalsRes.rows) { totals[r.type] = r.total; counts[r.type] = r.cnt; }

  const byCatRes = await pool.query(
    `select c.type, c.name, count(e.*)::int as cnt, coalesce(sum(e.amount),0)::int as total
       from app.budget_categories c
       left join app.entries e
         on e.category_id = c.id
        and e.entry_date between $1 and $2
      group by c.id, c.type, c.name, c.display_order
     having coalesce(sum(e.amount),0) > 0
      order by c.type, total desc`,
    [start, end]
  );
  const expense_by_category = byCatRes.rows
    .filter(r => r.type === 'expense')
    .map(r => ({ category: r.name, total: r.total, count: r.cnt }));
  const income_by_category = byCatRes.rows
    .filter(r => r.type === 'income')
    .map(r => ({ category: r.name, total: r.total, count: r.cnt }));

  return ok({
    timezone: TZ,
    month: m,
    income_total: totals.income,
    expense_total: totals.expense,
    balance: totals.income - totals.expense,
    counts,
    expense_by_category,
    income_by_category,
    top_expense_categories: expense_by_category.slice(0, 3),
  });
}

async function budgetVsActualGet() {
  const m = kstThisMonth();
  const thisStart = kstMonthStart(m), thisEnd = kstMonthEnd(m);
  const avgStart = kstMonthStart(kstMonthMinus(m, 3));    // 3개월 전 1일
  const avgEnd   = kstMonthEnd(kstMonthMinus(m, 1));      // 직전 달 마지막 날

  const { rows } = await pool.query(
    `with avg_3m as (
       select category_id, sum(amount)::int as sum_3m
         from app.entries
        where type = 'expense' and entry_date between $1 and $2
        group by category_id
     ),
     this_m as (
       select category_id, sum(amount)::int as actual
         from app.entries
        where type = 'expense' and entry_date between $3 and $4
        group by category_id
     )
     select c.name,
            round(coalesce(a.sum_3m, 0) / 3.0)::int as avg_monthly,
            coalesce(t.actual, 0)::int             as actual,
            coalesce(t.actual, 0) - round(coalesce(a.sum_3m, 0) / 3.0)::int as diff
       from app.budget_categories c
       left join avg_3m a on a.category_id = c.id
       left join this_m t on t.category_id = c.id
      where c.type = 'expense'
        and (a.sum_3m is not null or t.actual is not null)
      order by actual desc nulls last`,
    [avgStart, avgEnd, thisStart, thisEnd]
  );

  const items = rows.map(r => ({
    category: r.name,
    avg_monthly: r.avg_monthly,
    actual: r.actual,
    diff: r.diff,
    diff_pct: r.avg_monthly ? Math.round((r.actual - r.avg_monthly) * 100 / r.avg_monthly) : null,
  }));

  return ok({
    timezone: TZ,
    month: m,
    basis: '최근 3개월(이번 달 제외) 평균',
    avg_window: { start: avgStart, end: avgEnd },
    items,
  });
}

// ---------- main handler ----------
module.exports = async (req, res) => {
  try {
    const view = (req.query && req.query.view) || '';
    const id   = (req.query && req.query.id)   || '';
    const method = req.method;

    let r;
    if (method === 'GET'    && view === 'categories')        r = await categoriesGet();
    else if (method === 'GET'    && view === 'entries')      r = await entriesGet(req.query.month);
    else if (method === 'POST'   && view === 'entries')      r = await entriesPost(req.body);
    else if (method === 'PATCH'  && view === 'entries')      r = await entriesPatch(id, req.body);
    else if (method === 'DELETE' && view === 'entries')      r = await entriesDelete(id);
    else if (method === 'GET'    && view === 'stats')        r = await statsGet();
    else if (method === 'GET'    && view === 'budget-vs-actual') r = await budgetVsActualGet();
    else return res.status(400).json({ error: 'view= categories | entries | stats | budget-vs-actual' });

    if (r.body === null) return res.status(r.status).end();
    return res.status(r.status).json(r.body);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: '서버 오류', detail: e.message });
  }
};
