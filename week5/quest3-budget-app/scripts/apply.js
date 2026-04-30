// ===========================================================
// schema → seed → 간단 검증
//   $ node scripts/apply.js
// 상세 검증은 API (?view=stats / entries) 로 위임
// ===========================================================
require('dotenv').config({ path: __dirname + '/../.env.local' });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const ROOT = path.join(__dirname, '..');

(async () => {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error('❌ DATABASE_URL 없음'); process.exit(1); }

  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  console.log('✅ DB 연결됨');

  try {
    const schema = fs.readFileSync(path.join(ROOT, 'sql/schema.sql'), 'utf8');
    await client.query(schema);
    console.log('✅ schema.sql 적용 완료');

    const seed = fs.readFileSync(path.join(ROOT, 'sql/seed.sql'), 'utf8');
    await client.query(seed);
    console.log('✅ seed.sql 적용 완료');

    console.log('\n──────── 검증 결과 ────────');

    // 카테고리 — type별 분리 출력
    const cats = await client.query(
      `select type, code, name, display_order
         from app.budget_categories
        order by type, display_order`
    );
    const expense = cats.rows.filter(r => r.type === 'expense');
    const income  = cats.rows.filter(r => r.type === 'income');
    console.log(`\n[1] 카테고리: 지출 ${expense.length}개 + 수입 ${income.length}개`);
    console.log('    [지출]');
    expense.forEach(r => console.log(`      ${String(r.display_order).padStart(2)}. ${r.code.padEnd(13)} ${r.name}`));
    console.log('    [수입]');
    income.forEach(r => console.log(`      ${r.display_order}. ${r.code.padEnd(13)} ${r.name}`));

    // entries — type별 합계
    const totals = await client.query(
      `select type, count(*)::int as cnt, coalesce(sum(amount),0)::int as total
         from app.entries group by type order by type`
    );
    console.log(`\n[2] entries 합계 (전체):`);
    totals.rows.forEach(r =>
      console.log(`    ${r.type.padEnd(8)}  ${String(r.cnt).padStart(3)}건  ₩${r.total.toLocaleString().padStart(11)}`));

    // 최근 3건 (확인용)
    const recent = await client.query(
      `select to_char(e.entry_date, 'YYYY-MM-DD') as d, e.type, c.name, e.amount, e.memo
         from app.entries e join app.budget_categories c on c.id = e.category_id
        order by e.entry_date desc, e.created_at desc
        limit 3`
    );
    console.log(`\n[3] 최근 3건:`);
    recent.rows.forEach(r =>
      console.log(`    ${r.d}  ${r.type.padEnd(7)}  ${r.name.padEnd(7)}  ₩${r.amount.toLocaleString().padStart(10)}  ${r.memo || ''}`));

    console.log('\n상세 통계는 API 로:  curl "http://localhost:3000/api/budget?view=stats"\n');
  } catch (e) {
    console.error('❌ 적용 실패:', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
