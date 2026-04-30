-- ===========================================================
-- Quest 3 — 데모 시드 (v2)
--   12 expense + 4 income 카테고리
--   entries 약 12건 (지출 10 + 수입 2)
--   재실행 가능
-- ===========================================================

-- 1) 정리 (entries → categories 순)
delete from app.entries;
delete from app.budget_categories;

-- 2) 카테고리 — 지출 12개
insert into app.budget_categories (type, code, name, display_order) values
  ('expense', 'housing',      '주거',     1),
  ('expense', 'food',         '식비',     2),
  ('expense', 'transport',    '교통',     3),
  ('expense', 'telecom',      '통신',     4),
  ('expense', 'subscription', '구독',     5),
  ('expense', 'shopping',     '쇼핑',     6),
  ('expense', 'pet',          '반려',     7),
  ('expense', 'leisure',      '여가',     8),
  ('expense', 'health',       '의료/건강', 9),
  ('expense', 'education',    '교육',    10),
  ('expense', 'saving',       '저축/투자', 11),
  ('expense', 'etc',          '기타',    12);

-- 3) 카테고리 — 수입 4개
insert into app.budget_categories (type, code, name, display_order) values
  ('income',  'salary',       '급여',     1),
  ('income',  'side',         '부수입',   2),
  ('income',  'allowance',    '용돈',     3),
  ('income',  'other',        '기타',     4);

-- 4) 데모 entries (KST 기준 최근 7일)
--    DB current_date 는 UTC 기준이므로 KST와 1일 어긋날 수 있으나,
--    entry_date 는 명시적 날짜 지정으로 인접 일자에 분포
do $$
declare
  v_food         uuid := (select id from app.budget_categories where type='expense' and code='food');
  v_transport    uuid := (select id from app.budget_categories where type='expense' and code='transport');
  v_subscription uuid := (select id from app.budget_categories where type='expense' and code='subscription');
  v_shopping     uuid := (select id from app.budget_categories where type='expense' and code='shopping');
  v_leisure      uuid := (select id from app.budget_categories where type='expense' and code='leisure');
  v_salary       uuid := (select id from app.budget_categories where type='income'  and code='salary');
  v_side         uuid := (select id from app.budget_categories where type='income'  and code='side');
begin
  -- 지출 10건
  insert into app.entries (type, category_id, amount, entry_date, memo) values
    ('expense', v_food,         12500, current_date - 0, '점심 — 김치찌개'),
    ('expense', v_food,          4500, current_date - 1, '아이스 아메리카노'),
    ('expense', v_food,         28000, current_date - 3, '저녁 회식'),
    ('expense', v_food,          8000, current_date - 5, '편의점 야식'),
    ('expense', v_transport,     1450, current_date - 0, '지하철 출퇴근'),
    ('expense', v_transport,     1450, current_date - 1, '지하철 출퇴근'),
    ('expense', v_subscription, 13900, current_date - 7, '넷플릭스 정기결제'),
    ('expense', v_shopping,     35000, current_date - 4, '쿠팡 생필품'),
    ('expense', v_leisure,      18000, current_date - 6, '영화관'),
    ('expense', v_food,         15800, current_date - 2, '배달 — 부대찌개');

  -- 수입 2건
  insert into app.entries (type, category_id, amount, entry_date, memo) values
    ('income',  v_salary,    4000000, date_trunc('month', current_date)::date + 24, '월급'),
    ('income',  v_side,       200000, current_date - 5, '프리랜스 작업');
end $$;
