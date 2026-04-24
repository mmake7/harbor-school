-- =============================================================
-- 긴급 롤백: RLS 일괄 비활성화
-- 대상 DB: Supabase(PostgreSQL)
-- 실행 방법: Supabase Studio → SQL Editor에 복사 붙여넣기 후 실행
-- =============================================================
--
-- 사용 시점
--   - enable-rls.sql 적용 후 앱에서 500 에러 / 빈 결과 / 특정 기능 실패가 발생한 경우
--   - (이론상 postgres 역할은 RLS 우회되므로 문제 없어야 하지만, 만일의 대비)
--
-- 참고: 일부 테이블만 롤백하려면 해당 라인만 골라 실행
-- =============================================================

ALTER TABLE fridge_ingredients DISABLE ROW LEVEL SECURITY;
ALTER TABLE fridge_recipes     DISABLE ROW LEVEL SECURITY;

ALTER TABLE board_posts        DISABLE ROW LEVEL SECURITY;
ALTER TABLE board_reactions    DISABLE ROW LEVEL SECURITY;
ALTER TABLE board_comments     DISABLE ROW LEVEL SECURITY;

ALTER TABLE balance_questions  DISABLE ROW LEVEL SECURITY;
ALTER TABLE balance_votes      DISABLE ROW LEVEL SECURITY;

ALTER TABLE life_profiles      DISABLE ROW LEVEL SECURITY;

ALTER TABLE fortune_daily      DISABLE ROW LEVEL SECURITY;

ALTER TABLE landing_copies     DISABLE ROW LEVEL SECURITY;

-- =============================================================
-- 확인 쿼리 (롤백 후 검증용)
--   → 모든 행의 rowsecurity 가 false 여야 정상
-- =============================================================
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'fridge_ingredients', 'fridge_recipes',
    'board_posts', 'board_reactions', 'board_comments',
    'balance_questions', 'balance_votes',
    'life_profiles', 'fortune_daily', 'landing_copies'
  )
ORDER BY tablename;
