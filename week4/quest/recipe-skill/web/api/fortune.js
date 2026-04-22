import pg from 'pg';
import Anthropic from '@anthropic-ai/sdk';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

function todayKST() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
}

function formatDate(d) {
  if (typeof d === 'string') return d.slice(0, 10);
  if (d instanceof Date) return d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
  return String(d);
}

function rowToResponse(row, isNew) {
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
    is_new: isNew,
  };
}

const SYSTEM_PROMPT = `당신은 '혼삶 타로냥'이라는 이름의 AI 점성술사예요. 1인 가구의 하루 한 번 받는 미니 운세를 만들어 주는 역할이에요.

운세 영역 4가지:
- honbap (혼밥): 오늘의 끼니, 장보기, 요리, 배달 등 먹는 것 전반
- jachi  (자취): 집안일, 청소, 빨래, 살림살이, 택배, 공과금
- save   (저축/소비): 충동구매 주의, 지출 판단, 작은 행운의 돈
- meet   (만남/소통): 연락, 약속, 사람과의 거리감, 외출 여부

규칙:
1) 응답은 반드시 순수 JSON 한 덩어리. 앞뒤 설명·코드 펜스·주석 금지.
2) 한국어, 다정한 존댓말. 반말·해체는 쓰지 않아요.
3) 각 영역 text는 20~40자. 구체적이고 오늘 행동 지시형.
4) overall_message는 50~80자 격려 한 문장.
5) lucky_item은 1인 가구가 오늘 실제로 만날 수 있는 물건·음식·장소 (예: 아메리카노, 수면양말, 편의점 김밥, 중고거래).
6) daily_advice는 오늘 실행 가능한 작은 행동 1가지, 40~60자.
7) 점수(1~5)는 적절히 분포. 전부 5거나 전부 1인 경우 금지. 너무 우울해도 안 되고 너무 과장돼도 안 돼요.
8) 날짜·세션이 달라지면 반드시 다른 내용이 나오도록 변주해 주세요. 고정된 상투어 반복 금지.

출력 스키마 (정확히 이 키·타입만):
{
  "overall_score": 1-5 정수,
  "overall_message": "문자열",
  "themes": {
    "honbap": { "score": 1-5, "text": "문자열" },
    "jachi":  { "score": 1-5, "text": "문자열" },
    "save":   { "score": 1-5, "text": "문자열" },
    "meet":   { "score": 1-5, "text": "문자열" }
  },
  "lucky_item": "문자열",
  "daily_advice": "문자열"
}`;

function userPrompt(seed, date) {
  return `오늘 날짜: ${date}
시드(참고용, 응답에 노출 금지): ${seed}

위 정보를 근거로 오늘의 혼삶 운세를 생성해 주세요. JSON만 출력하세요.`;
}

function extractJson(text) {
  const cleaned = text.replace(/```json\s*|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start >= 0 && end > start) return cleaned.slice(start, end + 1);
  return cleaned;
}

function clampScore(n) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return 3;
  return Math.max(1, Math.min(5, v));
}

function truncStr(s, max) {
  const str = typeof s === 'string' ? s : String(s ?? '');
  return str.length > max ? str.slice(0, max) : str;
}

function validateParsed(p) {
  if (!p || typeof p !== 'object') return '운세 데이터 형식이 잘못되었어요';
  if (!p.themes || typeof p.themes !== 'object') return 'themes 필드가 없어요';
  for (const k of ['honbap', 'jachi', 'save', 'meet']) {
    const t = p.themes[k];
    if (!t || typeof t.text !== 'string') return `themes.${k} 형식이 잘못되었어요`;
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sessionId = getSessionId(req);
  if (!sessionId) return res.status(400).json({ error: 'session id required' });

  const today = todayKST();

  try {
    const existing = await pool.query(
      'SELECT * FROM fortune_daily WHERE session_id = $1 AND fortune_date = $2 LIMIT 1',
      [sessionId, today]
    );
    if (existing.rows.length > 0) {
      return res.json(rowToResponse(existing.rows[0], false));
    }

    let message;
    try {
      message = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt(sessionId, today) }],
      });
    } catch (e) {
      console.error('[fortune] claude call failed', e);
      return res.status(502).json({
        error: '오늘의 운세를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
      });
    }

    const rawText = (message.content?.[0]?.text) || '';
    const jsonStr = extractJson(rawText);

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error('[fortune] json parse failed', rawText);
      return res.status(502).json({
        error: '운세 데이터 해석에 실패했어요. 잠시 후 다시 시도해 주세요.',
      });
    }

    const err = validateParsed(parsed);
    if (err) {
      console.error('[fortune] validation failed:', err, parsed);
      return res.status(502).json({
        error: '운세 항목이 일부 누락됐어요. 잠시 후 다시 시도해 주세요.',
      });
    }

    const honbap_score = clampScore(parsed.themes.honbap.score);
    const jachi_score  = clampScore(parsed.themes.jachi.score);
    const save_score   = clampScore(parsed.themes.save.score);
    const meet_score   = clampScore(parsed.themes.meet.score);
    const overall_score = clampScore(
      parsed.overall_score ?? Math.round((honbap_score + jachi_score + save_score + meet_score) / 4)
    );

    const values = [
      sessionId, today,
      honbap_score, truncStr(parsed.themes.honbap.text, 200),
      jachi_score,  truncStr(parsed.themes.jachi.text, 200),
      save_score,   truncStr(parsed.themes.save.text, 200),
      meet_score,   truncStr(parsed.themes.meet.text, 200),
      overall_score,
      truncStr(parsed.overall_message || '오늘도 혼자서도 반짝이는 하루가 되기를.', 500),
      truncStr(parsed.lucky_item || '따뜻한 아메리카노', 100),
      truncStr(parsed.daily_advice || '오늘은 내가 좋아하는 것 하나만 챙겨 주세요.', 500),
    ];

    const insert = await pool.query(
      `INSERT INTO fortune_daily
         (session_id, fortune_date,
          honbap_score, honbap_text, jachi_score, jachi_text,
          save_score, save_text, meet_score, meet_text,
          overall_score, overall_message, lucky_item, daily_advice)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (session_id, fortune_date) DO NOTHING
       RETURNING *`,
      values
    );

    if (insert.rows.length > 0) {
      return res.json(rowToResponse(insert.rows[0], true));
    }

    const reSelect = await pool.query(
      'SELECT * FROM fortune_daily WHERE session_id = $1 AND fortune_date = $2 LIMIT 1',
      [sessionId, today]
    );
    if (reSelect.rows.length === 0) {
      console.error('[fortune] race-safe re-select returned nothing');
      return res.status(500).json({
        error: '운세 저장에 실패했어요. 잠시 후 다시 시도해 주세요.',
      });
    }
    return res.json(rowToResponse(reSelect.rows[0], false));
  } catch (error) {
    console.error('[fortune]', error);
    return res.status(500).json({
      error: '운세 서비스에 일시적 문제가 생겼어요. 잠시 후 다시 시도해 주세요.',
    });
  }
}
