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

const SYSTEM_PROMPT = `당신은 1인 가구 자취생을 위한 요리 전문가입니다. 주어진 냉장고 재료로 간단하고 빠른 레시피 3가지를 제안합니다.

조건:
- 1인분 기준
- 15분 이내 완성
- 자취생 난이도 (냄비/프라이팬/칼/도마만 사용)
- 냉장고 재료만 사용
- 유통기한 임박 재료 우선 활용
- 3가지 버전: "초간단" / "든든한" / "색다른"

반드시 아래 JSON 형식으로만 응답하세요. 다른 설명 없이 JSON만 출력하세요.

{
  "recipes": [
    {
      "title": "레시피 이름",
      "version": "초간단",
      "calories": 450,
      "cook_time": 10,
      "difficulty": "⭐",
      "ingredients": ["계란", "신김치", "대파"],
      "steps": "1. 팬에 기름을 두르고...\\n2. ...\\n3. ...",
      "tip": "자취생 꿀팁 한 줄"
    }
  ]
}

필드 규칙:
- version: "초간단" | "든든한" | "색다른" (정확히 이 셋)
- difficulty: "⭐" | "⭐⭐" | "⭐⭐⭐"
- calories: 숫자 (kcal)
- cook_time: 숫자 (분)
- ingredients: 문자열 배열 (재료 이름만)
- steps: 줄바꿈(\\n)으로 구분된 단계
- tip: 한 줄 팁`;

async function uploadToNotion(recipe) {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        이름: { title: [{ text: { content: recipe.title } }] },
        날짜: { date: { start: new Date().toISOString().split('T')[0] } },
        칼로리: { number: recipe.calories },
        시간: { number: recipe.cook_time },
        난이도: { select: { name: recipe.difficulty } },
        재료: {
          multi_select: recipe.ingredients.map((i) => ({
            name: typeof i === 'string' ? i : i.name,
          })),
        },
        버전: { select: { name: recipe.version } },
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Notion ${response.status}: ${errText}`);
  }
  const data = await response.json();
  return data.id;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT * FROM fridge_recipes ORDER BY created_at DESC LIMIT 50'
      );
      return res.json(result.rows);
    }

    if (req.method === 'POST') {
      const ingredientsResult = await pool.query(
        'SELECT * FROM fridge_ingredients ORDER BY expiry ASC'
      );
      const ingredients = ingredientsResult.rows;

      if (ingredients.length === 0) {
        return res.status(400).json({
          error: '냉장고가 비어있어요. 재료를 먼저 추가해주세요.',
        });
      }

      const userPrompt = `냉장고에 있는 재료:
${ingredients
  .map((i) => `- ${i.name} ${i.quantity || ''} (유통기한: ${i.expiry || '미지정'})`)
  .join('\n')}

위 재료로 레시피 3가지(초간단/든든한/색다른)를 JSON으로 만들어주세요.`;

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: userPrompt }],
      });

      const text = message.content[0].text;
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      let parsed;
      try {
        parsed = JSON.parse(cleanText);
      } catch (e) {
        return res.status(502).json({
          error: 'Claude 응답 JSON 파싱 실패',
          raw: text,
        });
      }
      const { recipes } = parsed;
      if (!Array.isArray(recipes)) {
        return res.status(502).json({ error: 'recipes 배열 없음', raw: parsed });
      }

      const saved = [];
      for (const recipe of recipes) {
        let notionPageId = null;
        try {
          notionPageId = await uploadToNotion(recipe);
        } catch (e) {
          console.error('[notion] upload failed:', e.message);
        }

        const result = await pool.query(
          `INSERT INTO fridge_recipes
           (title, version, calories, cook_time, difficulty, ingredients, steps, tip, notion_page_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          [
            recipe.title,
            recipe.version,
            recipe.calories,
            recipe.cook_time,
            recipe.difficulty,
            JSON.stringify(recipe.ingredients),
            recipe.steps,
            recipe.tip,
            notionPageId,
          ]
        );
        saved.push(result.rows[0]);
      }

      return res.status(201).json({ recipes: saved });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[recipe]', error);
    return res.status(500).json({ error: error.message });
  }
}
