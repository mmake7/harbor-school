-- =============================================================
-- 4주차 Q6: 혼삶 라이프 벤치마크 스키마 (문서용)
-- 대상 DB: Supabase(PostgreSQL)
-- 실행 방법: Supabase Studio → SQL Editor에 복사 붙여넣기 후 실행
-- 주의: 앱 코드에서 자동 생성하지 않음. 이 파일을 직접 실행해야 함.
-- =============================================================

-- 1) 라이프 프로필 (세션당 1개 권장, 앱 코드는 UNIQUE 여부와 무관하게 안전하게 upsert)
CREATE TABLE IF NOT EXISTS life_profiles (
  id                BIGSERIAL PRIMARY KEY,
  age_group         TEXT NOT NULL CHECK (age_group IN ('20대','30대','40대','50대+')),
  job_category      TEXT NOT NULL CHECK (job_category IN ('IT','금융','공공','서비스','제조','기타')),
  experience_years  TEXT NOT NULL CHECK (experience_years IN ('1년미만','1-3년','3-5년','5-10년','10년+')),
  region            TEXT NOT NULL CHECK (region IN ('수도권','광역시','그외')),
  monthly_salary    INT  NOT NULL CHECK (monthly_salary > 0),     -- 만원 단위
  expense_housing   INT  NOT NULL DEFAULT 0 CHECK (expense_housing   >= 0),
  expense_food      INT  NOT NULL DEFAULT 0 CHECK (expense_food      >= 0),
  expense_transport INT  NOT NULL DEFAULT 0 CHECK (expense_transport >= 0),
  expense_leisure   INT  NOT NULL DEFAULT 0 CHECK (expense_leisure   >= 0),
  expense_shopping  INT  NOT NULL DEFAULT 0 CHECK (expense_shopping  >= 0),
  session_id        TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 세션당 1개만 유지 (있어도 없어도 앱 코드는 동작하지만, 권장)
CREATE UNIQUE INDEX IF NOT EXISTS idx_life_profiles_session_unique
  ON life_profiles (session_id);
CREATE INDEX IF NOT EXISTS idx_life_profiles_job_age
  ON life_profiles (job_category, age_group);
