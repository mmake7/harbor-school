-- ===========================================================
-- Q4 / Step A — 분석 결과 저장 테이블
--   monthly_report : 월간 자동 리포트 (등급 포함)
--   chat_query     : 사용자 자연어 질문 + 응답 로그
-- ===========================================================

CREATE TABLE IF NOT EXISTS app.budget_analyses (
  id            BIGSERIAL PRIMARY KEY,
  analysis_type VARCHAR(20) NOT NULL CHECK (analysis_type IN ('monthly_report', 'chat_query')),
  period        VARCHAR(10),                                            -- 'YYYY-MM' (chat은 NULL 가능)
  query         TEXT,                                                   -- chat_query일 때 사용자 질문
  result_text   TEXT NOT NULL,
  result_json   JSONB,                                                  -- 구조화된 결과
  grade         CHAR(2),                                                -- 'A+', 'A', 'B+', ... (monthly_report만)
  tokens_used   INT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analyses_type_period
  ON app.budget_analyses (analysis_type, period);

CREATE INDEX IF NOT EXISTS idx_analyses_created
  ON app.budget_analyses (created_at DESC);

COMMENT ON TABLE  app.budget_analyses IS 'Q4 / PRIME / Insight — 월간 리포트 + 대화형 분석 로그';
COMMENT ON COLUMN app.budget_analyses.grade IS 'A+, A, A-, B+, B, B-, C+, C, C- (지출 절제·저축률 종합)';
