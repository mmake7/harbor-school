// ===========================================================
// /api/analyze — Vercel serverless function (Q4)
//   ?view= 분기:
//     - GET  ?view=monthly[&month=YYYY-MM]   월간 리포트 (DB 캐시 + Claude)
//     - POST ?view=cache-clear[&month=...]   특정 월 캐시 삭제
//
// 시간대: KST (Asia/Seoul) 일관 처리. 응답에 timezone 명시.
// ===========================================================
const { Pool } = require('pg');
const Anthropic = require('@anthropic-ai/sdk');
const { kstThisMonth, kstMonthStart, kstMonthEnd, kstMonthMinus } = require('../lib/datetime');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = 'claude-haiku-4-5-20251001';
const TZ = 'Asia/Seoul';

const SYSTEM_PROMPT = `너는 PRIME / Insight 가계부 분석 비서야.
형이 한 달 가계부 데이터를 던지면, 다음 4축으로 분석해.

[분석 4축]
축 1. 현금 흐름 — 수입/지출/저축률 (저축률 = (수입-지출)/수입 * 100)
축 2. 카테고리 — 상위 5개 + 고정비 vs 변동비 분류
   고정비: 통신, 주거, 구독, 교육 등 매월 일정한 것
   변동비: 식비, 외식, 쇼핑, 여가, 반려, 의료 등 매번 다른 것
축 3. 시간 패턴 — 평일 vs 주말, 일별 분포, 특이일 (평소 대비 2배 이상)
축 4. 등급 + 조언 — 종합 등급 (A+~F) + 한 줄 진단 + 다음 달 1~2개 액션

[등급 기준]
A+/A/A-: 저축률 30% 이상, 패턴 안정
B+/B/B-: 저축률 15~30%, 일부 카테고리 과다
C+/C/C-: 저축률 0~15%, 변동비 과다
D/F: 저축률 0% 이하 또는 통제 불가 패턴

[응답 형식 — 반드시 순수 JSON, 마크다운 코드블록 없이]
{
  "headline": "한 줄 요약 (40자 이내)",
  "grade": "B+",
  "cashflow": {
    "income": 4520000,
    "expense": 1850000,
    "balance": 2670000,
    "savings_rate": 59.1,
    "comment": "저축률 60% 우수"
  },
  "category": {
    "top5": [{"name":"식비","amount":591900,"count":51,"ratio":28.3}, ...],
    "fixed_vs_variable": {"fixed": 950000, "variable": 1100000, "fixed_ratio": 46.3},
    "comment": "변동비 비중 적정"
  },
  "time_pattern": {
    "weekday_avg": 35000,
    "weekend_avg": 45000,
    "anomalies": ["4월 30일 월세 지출", "4월 25일 급여 입금"],
    "comment": "..."
  },
  "advice": [
    "다음 달 시도해볼 액션 1",
    "다음 달 시도해볼 액션 2"
  ]
}

[톤]
- 형 입장에서 친근하게 (반말 OK)
- 비난 X, 객관적 + 격려
- 추측·과장 금지 — 데이터로 뒷받침되는 것만
- 카테고리명은 데이터 그대로 (식비/주거 등)
- 출력은 순수 JSON 한 덩어리만, 다른 텍스트 일절 X`;


// ──────────── helpers ────────────

function isYm(s) { return typeof s === 'string' && /^\d{4}-\d{2}$/.test(s); }

function ok(body, status = 200) { return { status, body }; }
function err(status, msg, detail) {
  return { status, body: detail ? { error: msg, detail } : { error: msg } };
}

async function aggregateMonth(month) {
  const start = kstMonthStart(month);
  const end = kstMonthEnd(month);

  const { rows: entries } = await pool.query(
    `SELECT e.id, e.type, e.amount,
            to_char(e.entry_date, 'YYYY-MM-DD') AS d,
            extract(dow FROM e.entry_date)::int AS dow,
            e.memo, c.code AS cat_code, c.name AS cat_name
       FROM app.entries e
       JOIN app.budget_categories c ON c.id = e.category_id
      WHERE e.entry_date BETWEEN $1 AND $2
      ORDER BY e.entry_date, e.created_at`,
    [start, end]
  );

  let income = 0, expense = 0;
  const byCat = new Map();
  const byDay = new Map();
  let weekdayExp = 0, weekdayDays = new Set();
  let weekendExp = 0, weekendDays = new Set();

  for (const e of entries) {
    if (e.type === 'income')  income  += e.amount;
    if (e.type === 'expense') expense += e.amount;

    const k = e.cat_name;
    if (!byCat.has(k)) byCat.set(k, { name: k, type: e.type, count: 0, total: 0 });
    const cat = byCat.get(k); cat.count++; cat.total += e.amount;

    if (!byDay.has(e.d)) byDay.set(e.d, { d: e.d, dow: e.dow, expense: 0, income: 0, count: 0 });
    const day = byDay.get(e.d); day.count++;
    if (e.type === 'expense') day.expense += e.amount; else day.income += e.amount;

    if (e.type === 'expense') {
      const isWeekend = e.dow === 0 || e.dow === 6;
      if (isWeekend) { weekendExp += e.amount; weekendDays.add(e.d); }
      else           { weekdayExp += e.amount; weekdayDays.add(e.d); }
    }
  }

  // top 5 expense entries (큰 지출 식별용)
  const topExpenses = entries
    .filter(e => e.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map(e => ({ d: e.d, cat: e.cat_name, amt: e.amount, memo: e.memo }));

  return {
    month,
    counts: {
      total_entries: entries.length,
      expense: entries.filter(e => e.type === 'expense').length,
      income:  entries.filter(e => e.type === 'income').length,
    },
    cashflow: {
      income, expense,
      balance: income - expense,
      savings_rate: income > 0 ? Math.round(((income - expense) / income) * 1000) / 10 : 0,
    },
    by_category: Array.from(byCat.values()).sort((a, b) => b.total - a.total),
    by_day: Array.from(byDay.values()).sort((a, b) => a.d.localeCompare(b.d)),
    weekday: { expense_total: weekdayExp, days: weekdayDays.size,
               avg_per_day: weekdayDays.size ? Math.round(weekdayExp / weekdayDays.size) : 0 },
    weekend: { expense_total: weekendExp, days: weekendDays.size,
               avg_per_day: weekendDays.size ? Math.round(weekendExp / weekendDays.size) : 0 },
    top_expenses: topExpenses,
  };
}

async function callClaude(aggregate) {
  const userMsg = `다음은 ${aggregate.month} 한 달 가계부 데이터(KST 기준):\n\n` +
                  JSON.stringify(aggregate, null, 2) +
                  `\n\n위 데이터를 기반으로 4축 분석한 JSON을 응답해.`;
  const t0 = Date.now();
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMsg }],
  });
  const elapsed = Date.now() - t0;
  const text = res.content[0]?.text?.trim() || '';
  // Strip markdown fence if any
  const json = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    throw new Error('Claude 응답 JSON 파싱 실패: ' + e.message + '\n원문 첫 200자: ' + text.slice(0, 200));
  }
  return { parsed, raw: text, usage: res.usage, elapsed_claude_ms: elapsed };
}

async function getCached(month) {
  const { rows } = await pool.query(
    `SELECT id, result_json, result_text, grade, tokens_used, created_at
       FROM app.budget_analyses
      WHERE analysis_type = 'monthly_report' AND period = $1
      ORDER BY created_at DESC
      LIMIT 1`,
    [month]
  );
  return rows[0] || null;
}

async function saveCache(month, parsed, rawText, usage) {
  const tokens = (usage?.input_tokens || 0) + (usage?.output_tokens || 0);
  const { rows } = await pool.query(
    `INSERT INTO app.budget_analyses
       (analysis_type, period, result_text, result_json, grade, tokens_used)
     VALUES ('monthly_report', $1, $2, $3::jsonb, $4, $5)
     RETURNING id, created_at`,
    [month, rawText, JSON.stringify(parsed), parsed.grade || null, tokens]
  );
  return rows[0];
}

async function clearCache(month) {
  const { rowCount } = await pool.query(
    `DELETE FROM app.budget_analyses
      WHERE analysis_type = 'monthly_report' AND period = $1`,
    [month]
  );
  return rowCount;
}


// ──────────── chat (Step C) ────────────

const SYSTEM_PROMPT_CHAT = `너는 PRIME / Insight 가계부 분석 비서야.
형이 자연어로 가계부 관련 질문을 던지면, 제공된 통계 데이터를 보고 답변해.

[답변 원칙]
1. 데이터 기반 — 추측 X, 데이터 인용 시 정확한 숫자
2. 친근한 반말 — 형 입장
3. 구체적 — "카페 13번, 평균 6,500원" 형태
4. 짧게 — 핵심 1~3문장 + 필요시 보충 1문장
5. 데이터에 없으면 솔직히 — "그 정보는 데이터에 없어"
6. 비난 X — 객관 + 격려

[제공받는 데이터]
- current_month: 이번 달 entries 통계 (카테고리별, 일별, 평일/주말 등)
- prev_month_comparison: 지난달 합계 (지난달 데이터 없으면 null)
- question: 형의 질문

[응답 형식 — 반드시 순수 JSON, 마크다운 코드블록 없이]
{
  "answer": "답변 본문 (1~4문장, 반말)",
  "data_used": ["참조한 데이터 키 목록 (예: by_category.식비.total)"],
  "follow_up_questions": [
    "이어서 궁금할 만한 질문 1",
    "이어서 궁금할 만한 질문 2"
  ]
}

[톤 예시]
질문: "이번 달 카페 얼마 썼어?"
답변: "카페에 13번 가서 75,400원 썼어. 평균 5,800원이고, 지난달보다 12% 적게 쓴 편이야. 주로 평일 오전에 가는 패턴."`;


async function aggregatePrevMonth(month) {
  const prev = kstMonthMinus(month, 1);
  const start = kstMonthStart(prev);
  const end = kstMonthEnd(prev);
  const { rows } = await pool.query(
    `SELECT type, c.name AS cat_name,
            count(*)::int AS cnt,
            coalesce(sum(amount), 0)::int AS total
       FROM app.entries e
       JOIN app.budget_categories c ON c.id = e.category_id
      WHERE e.entry_date BETWEEN $1 AND $2
      GROUP BY type, c.name
      ORDER BY total DESC`,
    [start, end]
  );
  if (rows.length === 0) return null;
  let income = 0, expense = 0;
  const byCat = [];
  for (const r of rows) {
    if (r.type === 'income')  income  += r.total;
    if (r.type === 'expense') expense += r.total;
    byCat.push({ name: r.cat_name, type: r.type, count: r.cnt, total: r.total });
  }
  return { month: prev, income, expense, balance: income - expense, by_category: byCat };
}

async function chatPost(body) {
  const { question, month: monthQ } = body || {};
  if (!question || typeof question !== 'string' || question.trim().length === 0)
    return err(400, 'question 필수 (문자열)');
  if (question.length > 500)
    return err(400, 'question 500자 이내');

  const month = isYm(monthQ) ? monthQ : kstThisMonth();

  const aggregate = await aggregateMonth(month);
  if (aggregate.counts.total_entries === 0)
    return err(404, `${month} 데이터 없음`);

  const prevMonthData = await aggregatePrevMonth(month).catch(() => null);

  const dataPayload = {
    current_month: aggregate,
    prev_month_comparison: prevMonthData,
    question,
  };

  const t0 = Date.now();
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 800,
    temperature: 0.7,
    system: SYSTEM_PROMPT_CHAT,
    messages: [{ role: 'user', content: JSON.stringify(dataPayload, null, 2) }],
  });
  const elapsed = Date.now() - t0;

  const text = res.content[0]?.text?.trim() || '';
  const json = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    // 파싱 실패해도 원문 반환 (UX 우선)
    parsed = { answer: text, data_used: [], follow_up_questions: [], _parse_error: e.message };
  }

  const tokens = (res.usage?.input_tokens || 0) + (res.usage?.output_tokens || 0);
  const { rows } = await pool.query(
    `INSERT INTO app.budget_analyses
       (analysis_type, period, query, result_text, result_json, tokens_used)
     VALUES ('chat_query', $1, $2, $3, $4::jsonb, $5)
     RETURNING id, created_at`,
    [month, question, text, JSON.stringify(parsed), tokens]
  );

  return ok({
    timezone: TZ,
    month,
    question,
    answer: parsed.answer,
    data_used: parsed.data_used || [],
    follow_up_questions: parsed.follow_up_questions || [],
    meta: {
      id: rows[0].id,
      created_at: rows[0].created_at,
      model: MODEL,
      tokens_used: tokens,
      input_tokens: res.usage?.input_tokens,
      output_tokens: res.usage?.output_tokens,
      elapsed_claude_ms: elapsed,
    },
  });
}


// ──────────── handler ────────────

module.exports = async (req, res) => {
  const t0 = Date.now();
  try {
    const view = (req.query && req.query.view) || '';
    const monthQ = req.query && req.query.month;
    const month = isYm(monthQ) ? monthQ : kstThisMonth();

    if (req.method === 'GET' && view === 'monthly') {
      const cached = await getCached(month);
      if (cached) {
        return res.status(200).json({
          timezone: TZ, month, cached: true,
          analysis: cached.result_json,
          meta: {
            id: cached.id,
            created_at: cached.created_at,
            tokens_used: cached.tokens_used,
            elapsed_ms: Date.now() - t0,
          },
        });
      }

      const aggregate = await aggregateMonth(month);
      if (aggregate.counts.total_entries === 0) {
        return res.status(404).json({ error: `${month} 데이터 없음` });
      }

      const { parsed, raw, usage, elapsed_claude_ms } = await callClaude(aggregate);
      const saved = await saveCache(month, parsed, raw, usage);
      const tokens = (usage?.input_tokens || 0) + (usage?.output_tokens || 0);

      return res.status(200).json({
        timezone: TZ, month, cached: false,
        analysis: parsed,
        meta: {
          id: saved.id,
          created_at: saved.created_at,
          model: MODEL,
          tokens_used: tokens,
          input_tokens: usage?.input_tokens,
          output_tokens: usage?.output_tokens,
          elapsed_claude_ms,
          elapsed_ms: Date.now() - t0,
        },
      });
    }

    if (req.method === 'POST' && view === 'cache-clear') {
      const deleted = await clearCache(month);
      return res.status(200).json({ month, deleted, message: `${deleted}건 삭제됨` });
    }

    if (req.method === 'POST' && view === 'chat') {
      const r = await chatPost(req.body);
      return res.status(r.status).json(r.body);
    }

    return res.status(400).json({ error: 'view= monthly | cache-clear | chat' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: '서버 오류', detail: e.message });
  }
};
