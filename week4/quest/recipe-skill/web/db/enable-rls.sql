-- =============================================================
-- Supabase RLS 일괄 활성화 (보안 경고 메일 해소용)
-- 대상 DB: Supabase(PostgreSQL)
-- 실행 방법: Supabase Studio → SQL Editor에 복사 붙여넣기 후 실행
-- =============================================================
--
-- 배경
--   - 본 앱은 Vercel Serverless에서 pg 라이브러리로 DATABASE_URL에 직접 연결
--   - 연결 역할은 Supabase의 postgres 슈퍼유저 (BYPASSRLS 속성 보유)
--   - 따라서 RLS를 ENABLE 해도 서버 쿼리는 자동으로 우회되어 기능에 영향 없음
--   - anon/service_role 키는 사용하지 않으므로 외부에서 RLS를 통한 접근 없음
--   - 경고 메일은 "public 스키마 테이블에 RLS 미적용" 이라는 구성 권고이므로
--     실제 공격면은 없지만, 경고 해소 및 방어선 확보 차원에서 일괄 활성화
--
-- 적용 범위 (총 10개 테이블)
--   냉장고:     fridge_ingredients, fridge_recipes
--   익명 게시판: board_posts, board_reactions, board_comments
--   밸런스 게임: balance_questions, balance_votes
--   라이프 벤치: life_profiles
--   운세:       fortune_daily
--   홈 랜딩:    landing_copies
-- =============================================================

ALTER TABLE fridge_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE fridge_recipes     ENABLE ROW LEVEL SECURITY;

ALTER TABLE board_posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_reactions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_comments     ENABLE ROW LEVEL SECURITY;

ALTER TABLE balance_questions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_votes      ENABLE ROW LEVEL SECURITY;

ALTER TABLE life_profiles      ENABLE ROW LEVEL SECURITY;

ALTER TABLE fortune_daily      ENABLE ROW LEVEL SECURITY;

ALTER TABLE landing_copies     ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- 확인 쿼리 (실행 후 검증용)
--   → 모든 행의 rowsecurity 가 true 여야 정상
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
