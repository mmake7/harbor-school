-- =============================================================
-- 4주차 Q7: 혼삶 운세 (AI 점성술사) 스키마 (문서용)
-- 대상 DB: Supabase(PostgreSQL)
-- 실행 방법: Supabase Studio → SQL Editor에 복사 붙여넣기 후 실행
-- 주의: 앱 코드에서 자동 생성하지 않음. 이 파일을 직접 실행해야 함.
-- =============================================================

-- 1) 일일 운세
--    (session_id, fortune_date) 조합으로 하루 1회만 생성.
--    앱 코드는 INSERT ... ON CONFLICT DO NOTHING + 재조회로 경쟁 안전.
CREATE TABLE IF NOT EXISTS fortune_daily (
  id               BIGSERIAL PRIMARY KEY,
  session_id       TEXT NOT NULL,
  fortune_date     DATE NOT NULL,          -- KST 기준 YYYY-MM-DD
  -- 혼밥
  honbap_score     INT  NOT NULL CHECK (honbap_score BETWEEN 1 AND 5),
  honbap_text      TEXT NOT NULL,
  -- 자취
  jachi_score      INT  NOT NULL CHECK (jachi_score  BETWEEN 1 AND 5),
  jachi_text       TEXT NOT NULL,
  -- 저축/소비
  save_score       INT  NOT NULL CHECK (save_score   BETWEEN 1 AND 5),
  save_text        TEXT NOT NULL,
  -- 만남/소통
  meet_score       INT  NOT NULL CHECK (meet_score   BETWEEN 1 AND 5),
  meet_text        TEXT NOT NULL,
  -- 종합 + 행운 아이템 + 오늘의 한마디
  overall_score    INT  NOT NULL CHECK (overall_score BETWEEN 1 AND 5),
  overall_message  TEXT NOT NULL,
  lucky_item       TEXT NOT NULL,
  daily_advice     TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, fortune_date)
);

CREATE INDEX IF NOT EXISTS idx_fortune_daily_session_date
  ON fortune_daily (session_id, fortune_date DESC);
