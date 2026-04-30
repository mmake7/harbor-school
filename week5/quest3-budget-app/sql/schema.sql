-- ===========================================================
-- Quest 3 — PRIME / Spend (가계부) 스키마 v2
--   PostgreSQL — 단일 사용자 데모
--   카테고리에 type 추가 (expense | income)
--   entries 테이블 (수입+지출 통합)
-- ===========================================================

create extension if not exists "pgcrypto";

create schema if not exists app;


-- ----------------------------------------------------------
-- DEV: 깔끔한 재구성을 위해 기존 app.* 가계부 테이블 drop
--   (4주차 life_*, fridge_* 등 다른 스키마 절대 건드리지 않음)
-- ----------------------------------------------------------
drop table if exists app.entries cascade;
drop table if exists app.expenses cascade;
drop table if exists app.budgets cascade;
drop table if exists app.budget_categories cascade;


-- ----------------------------------------------------------
-- 1. 카테고리 (type: expense | income)
-- ----------------------------------------------------------
create table app.budget_categories (
  id            uuid primary key default gen_random_uuid(),
  type          text not null check (type in ('expense', 'income')),
  code          text not null,
  name          text not null,
  display_order int  not null default 0,
  unique (type, code)
);

create index on app.budget_categories (type, display_order);

comment on table  app.budget_categories is '가계부 카테고리 — type(expense/income) + code + name';


-- ----------------------------------------------------------
-- 2. entries (수입+지출 통합 입력)
-- ----------------------------------------------------------
create table app.entries (
  id           uuid        primary key default gen_random_uuid(),
  type         text        not null check (type in ('expense', 'income')),
  category_id  uuid        not null references app.budget_categories(id) on delete restrict,
  amount       int         not null check (amount > 0),       -- KRW
  entry_date   date        not null,
  memo         text        check (memo is null or char_length(memo) <= 200),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on app.entries (entry_date desc);
create index on app.entries (category_id);
create index on app.entries (type, entry_date desc);

comment on column app.entries.type is 'expense | income (category.type 과 일치해야 함, API 레이어에서 검증)';


-- ----------------------------------------------------------
-- 3. updated_at 트리거
-- ----------------------------------------------------------
create or replace function app.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_entries_updated_at on app.entries;
create trigger trg_entries_updated_at
  before update on app.entries
  for each row execute function app.set_updated_at();
