-- ============================================================
-- today-room — 자체 JWT 인증 스키마 (Supabase Auth/RLS/Storage 미사용)
-- 모든 테이블 tr_ prefix, RLS 없음, 트리거 없음, 권한 처리는 서버(API route)에서 JWT 검증
-- ============================================================

-- pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- ============================================================
-- 1. Profiles + Sessions (자체 인증)
-- ============================================================

create table if not exists tr_profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  neighborhood text,
  created_at timestamptz default now()
);
create index if not exists tr_profiles_email_idx on tr_profiles (lower(email));

create table if not exists tr_auth_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references tr_profiles(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists tr_auth_sessions_token_idx on tr_auth_sessions (token_hash);
create index if not exists tr_auth_sessions_user_idx on tr_auth_sessions (user_id);

-- ============================================================
-- 2. Products
-- ============================================================

create table if not exists tr_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references tr_profiles(id) on delete cascade,
  title text not null,
  price integer not null,
  description text,
  category text not null check (category in ('furniture','lighting','accessory','fabric','plant')),
  images text[] default '{}',  -- ImageKit URL 최대 3장
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists tr_products_category_idx on tr_products (category);
create index if not exists tr_products_created_desc_idx on tr_products (created_at desc);
create index if not exists tr_products_user_idx on tr_products (user_id);

-- ============================================================
-- 3. Favorites
-- ============================================================

create table if not exists tr_favorites (
  user_id uuid not null references tr_profiles(id) on delete cascade,
  product_id uuid not null references tr_products(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, product_id)
);

-- ============================================================
-- 4. Chats + Messages
-- ============================================================

create table if not exists tr_chats (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references tr_products(id) on delete cascade,
  buyer_id uuid not null references tr_profiles(id),
  seller_id uuid not null references tr_profiles(id),
  created_at timestamptz default now(),
  unique (product_id, buyer_id)
);
create index if not exists tr_chats_buyer_idx on tr_chats (buyer_id);
create index if not exists tr_chats_seller_idx on tr_chats (seller_id);

create table if not exists tr_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references tr_chats(id) on delete cascade,
  sender_id uuid not null references tr_profiles(id),
  content text not null,
  created_at timestamptz default now()
);
create index if not exists tr_messages_chat_time_idx on tr_messages (chat_id, created_at);

-- ============================================================
-- 5. Orders (TossPayments 결제)
-- ============================================================

create table if not exists tr_orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references tr_profiles(id),
  product_id uuid not null references tr_products(id),
  amount integer not null,
  toss_order_id text not null unique,  -- TossPayments orderId (클라이언트 생성)
  payment_key text,                     -- Toss 결제 승인 후 저장
  payment_method text,
  status text not null default 'pending' check (status in ('pending','paid','canceled','failed')),
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists tr_orders_buyer_idx on tr_orders (buyer_id);
create index if not exists tr_orders_toss_idx on tr_orders (toss_order_id);
create index if not exists tr_orders_status_idx on tr_orders (status);
