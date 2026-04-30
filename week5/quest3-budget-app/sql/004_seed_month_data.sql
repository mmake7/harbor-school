-- ===========================================================
-- Q4 / Step A — 한 달치(2026-04 KST) 현실적 가계부 데이터 시드
--   * 추가만, 기존 entries(Q3 seed + 사용자 입력)는 보존
--   * 마커: created_at = '2026-04-30 23:59:00+00'
--   * 재실행 시 같은 마커 entries만 정리 후 재삽입 (idempotent)
--   * 25일 급여 4,000,000은 기존 entries에 이미 존재 → 중복 방지 위해 미포함
-- ===========================================================

DELETE FROM app.entries
 WHERE created_at = '2026-04-30 23:59:00+00';

DO $$
DECLARE
  v_food         uuid := (SELECT id FROM app.budget_categories WHERE type='expense' AND code='food');
  v_transport    uuid := (SELECT id FROM app.budget_categories WHERE type='expense' AND code='transport');
  v_telecom      uuid := (SELECT id FROM app.budget_categories WHERE type='expense' AND code='telecom');
  v_subscription uuid := (SELECT id FROM app.budget_categories WHERE type='expense' AND code='subscription');
  v_shopping     uuid := (SELECT id FROM app.budget_categories WHERE type='expense' AND code='shopping');
  v_pet          uuid := (SELECT id FROM app.budget_categories WHERE type='expense' AND code='pet');
  v_leisure      uuid := (SELECT id FROM app.budget_categories WHERE type='expense' AND code='leisure');
  v_health       uuid := (SELECT id FROM app.budget_categories WHERE type='expense' AND code='health');
  v_housing      uuid := (SELECT id FROM app.budget_categories WHERE type='expense' AND code='housing');
  v_side         uuid := (SELECT id FROM app.budget_categories WHERE type='income'  AND code='side');
  v_m timestamptz := '2026-04-30 23:59:00+00';
BEGIN
  -- ── 점심 (평일 22건) ──
  INSERT INTO app.entries (type, category_id, amount, entry_date, memo, created_at) VALUES
    ('expense', v_food, 12000, '2026-04-01', '점심 김밥',     v_m),
    ('expense', v_food, 13500, '2026-04-02', '점심 분식',     v_m),
    ('expense', v_food, 11000, '2026-04-03', '점심 도시락',   v_m),
    ('expense', v_food, 14000, '2026-04-06', '점심 부대찌개', v_m),
    ('expense', v_food, 12500, '2026-04-07', '점심 비빔밥',   v_m),
    ('expense', v_food, 11500, '2026-04-08', '점심 김치찌개', v_m),
    ('expense', v_food, 13000, '2026-04-09', '점심 백반',     v_m),
    ('expense', v_food, 12000, '2026-04-10', '점심 라멘',     v_m),
    ('expense', v_food, 13500, '2026-04-13', '점심 햄버거',   v_m),
    ('expense', v_food, 11000, '2026-04-14', '점심 김밥',     v_m),
    ('expense', v_food, 12500, '2026-04-15', '점심 비빔밥',   v_m),
    ('expense', v_food, 14000, '2026-04-16', '점심 돈가스',   v_m),
    ('expense', v_food, 12000, '2026-04-17', '점심 카레',     v_m),
    ('expense', v_food, 13000, '2026-04-20', '점심 짜장면',   v_m),
    ('expense', v_food, 11500, '2026-04-21', '점심 김밥',     v_m),
    ('expense', v_food, 12500, '2026-04-22', '점심 백반',     v_m),
    ('expense', v_food, 14000, '2026-04-23', '점심 부대찌개', v_m),
    ('expense', v_food, 11000, '2026-04-24', '점심 도시락',   v_m),
    ('expense', v_food, 13500, '2026-04-27', '점심 비빔밥',   v_m),
    ('expense', v_food, 12000, '2026-04-28', '점심 김치찌개', v_m),
    ('expense', v_food, 12500, '2026-04-29', '점심 분식',     v_m),
    ('expense', v_food, 13000, '2026-04-30', '점심 라멘',     v_m);

  -- ── 카페 (평일 14건) ──
  INSERT INTO app.entries (type, category_id, amount, entry_date, memo, created_at) VALUES
    ('expense', v_food, 5500, '2026-04-01', '스타벅스',       v_m),
    ('expense', v_food, 4800, '2026-04-03', '이디야',         v_m),
    ('expense', v_food, 5500, '2026-04-06', '스타벅스',       v_m),
    ('expense', v_food, 7000, '2026-04-08', '투썸 케이크',    v_m),
    ('expense', v_food, 4500, '2026-04-09', '빽다방',         v_m),
    ('expense', v_food, 5000, '2026-04-10', '이디야',         v_m),
    ('expense', v_food, 7500, '2026-04-14', '투썸 디저트',    v_m),
    ('expense', v_food, 5500, '2026-04-16', '스타벅스',       v_m),
    ('expense', v_food, 4800, '2026-04-17', '이디야',         v_m),
    ('expense', v_food, 5000, '2026-04-20', '빽다방',         v_m),
    ('expense', v_food, 5500, '2026-04-22', '스타벅스',       v_m),
    ('expense', v_food, 7000, '2026-04-24', '투썸 디저트',    v_m),
    ('expense', v_food, 5500, '2026-04-27', '스타벅스',       v_m),
    ('expense', v_food, 4500, '2026-04-29', '빽다방',         v_m);

  -- ── 출퇴근 교통 (평일 18건) ──
  INSERT INTO app.entries (type, category_id, amount, entry_date, memo, created_at) VALUES
    ('expense', v_transport, 3000, '2026-04-01', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-02', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-03', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-06', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-07', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-08', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-09', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-10', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-13', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-14', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-15', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-16', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-17', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-20', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-22', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-23', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-27', '지하철 왕복', v_m),
    ('expense', v_transport, 3000, '2026-04-29', '지하철 왕복', v_m);

  -- ── 주말 외식 (4건) ──
  INSERT INTO app.entries (type, category_id, amount, entry_date, memo, created_at) VALUES
    ('expense', v_food, 35000, '2026-04-04', '가족 외식', v_m),
    ('expense', v_food, 28000, '2026-04-11', '친구 식사', v_m),
    ('expense', v_food, 45000, '2026-04-18', '데이트 외식', v_m),
    ('expense', v_food, 32000, '2026-04-26', '가족 외식', v_m);

  -- ── 여가 (3건) ──
  INSERT INTO app.entries (type, category_id, amount, entry_date, memo, created_at) VALUES
    ('expense', v_leisure, 18000, '2026-04-05', '영화관',       v_m),
    ('expense', v_leisure, 22000, '2026-04-12', '노래방',       v_m),
    ('expense', v_leisure, 35000, '2026-04-19', '클라이밍',     v_m);

  -- ── 쇼핑 (4건, 큰 지출 포함) ──
  INSERT INTO app.entries (type, category_id, amount, entry_date, memo, created_at) VALUES
    ('expense', v_shopping,  65000, '2026-04-12', '봄옷',     v_m),
    ('expense', v_shopping, 120000, '2026-04-15', '러닝화',   v_m),
    ('expense', v_shopping,  75000, '2026-04-22', '소형 가전', v_m),
    ('expense', v_shopping,  28000, '2026-04-26', '책 묶음',   v_m);

  -- ── 구독 (2건, 월초) ──
  INSERT INTO app.entries (type, category_id, amount, entry_date, memo, created_at) VALUES
    ('expense', v_subscription, 14900, '2026-04-03', '디즈니플러스', v_m),
    ('expense', v_subscription,  8900, '2026-04-05', '스포티파이',   v_m);

  -- ── 통신 + 주거 (2건) ──
  INSERT INTO app.entries (type, category_id, amount, entry_date, memo, created_at) VALUES
    ('expense', v_telecom, 65000,  '2026-04-02', '통신비',  v_m),
    ('expense', v_housing, 850000, '2026-04-30', '월세',    v_m);

  -- ── 간식·편의점 (5건) ──
  INSERT INTO app.entries (type, category_id, amount, entry_date, memo, created_at) VALUES
    ('expense', v_food, 4500, '2026-04-03', '편의점 음료',   v_m),
    ('expense', v_food, 6000, '2026-04-09', '빵 간식',       v_m),
    ('expense', v_food, 3500, '2026-04-15', '아이스크림',    v_m),
    ('expense', v_food, 7500, '2026-04-22', '디저트',        v_m),
    ('expense', v_food, 5000, '2026-04-29', '편의점 야식',   v_m);

  -- ── 반려 (2건) ──
  INSERT INTO app.entries (type, category_id, amount, entry_date, memo, created_at) VALUES
    ('expense', v_pet, 32000, '2026-04-08', '강아지 사료',   v_m),
    ('expense', v_pet, 15000, '2026-04-22', '간식·영양제',   v_m);

  -- ── 의료 (1건) ──
  INSERT INTO app.entries (type, category_id, amount, entry_date, memo, created_at) VALUES
    ('expense', v_health, 25000, '2026-04-13', '약국 감기약', v_m);

  -- ── 부수입 (1건, 4/15) ──
  INSERT INTO app.entries (type, category_id, amount, entry_date, memo, created_at) VALUES
    ('income', v_side, 250000, '2026-04-15', '프리랜스 작업', v_m);
END $$;
