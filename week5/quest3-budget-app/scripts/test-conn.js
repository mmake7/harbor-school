// DB 연결 검증 — SELECT 1
require('dotenv').config({ path: __dirname + '/../.env.local' });
const { Client } = require('pg');

(async () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('❌ DATABASE_URL 없음 (.env.local 확인)');
    process.exit(1);
  }
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const r = await client.query('select 1 as ok, now() as ts, current_database() as db');
    console.log('✅ DB 연결 성공');
    console.log('   ok:', r.rows[0].ok);
    console.log('   ts:', r.rows[0].ts);
    console.log('   db:', r.rows[0].db);
  } catch (e) {
    console.error('❌ 연결 실패:', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
