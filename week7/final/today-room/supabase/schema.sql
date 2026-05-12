-- ============================================================
-- today-room (오늘의집 클론) — DB 스키마 + RLS
-- 모든 테이블에 tr_ prefix (기존 Supabase 프로젝트 재활용 가능)
-- Supabase SQL Editor에서 그대로 실행
-- ============================================================

-- ============================================================
-- 1. Tables (tr_ prefix)
-- ============================================================

create table if not exists tr_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  neighborhood text,
  created_at timestamptz default now()
);

create table if not exists tr_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references tr_profiles(id) on delete cascade,
  title text not null,
  price integer not null,
  description text,
  category text not null check (category in ('furniture','lighting','accessory','fabric','plant')),
  images text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists tr_products_category_idx on tr_products (category);
create index if not exists tr_products_created_desc_idx on tr_products (created_at desc);

create table if not exists tr_favorites (
  user_id uuid not null references tr_profiles(id) on delete cascade,
  product_id uuid not null references tr_products(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, product_id)
);

create table if not exists tr_chats (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references tr_products(id) on delete cascade,
  buyer_id uuid not null references tr_profiles(id),
  seller_id uuid not null references tr_profiles(id),
  created_at timestamptz default now(),
  unique (product_id, buyer_id)
);

create table if not exists tr_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references tr_chats(id) on delete cascade,
  sender_id uuid not null references tr_profiles(id),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists tr_messages_chat_time_idx on tr_messages (chat_id, created_at);

-- ============================================================
-- 2. RLS — enable on all tr_* tables
-- ============================================================

alter table tr_profiles enable row level security;
alter table tr_products enable row level security;
alter table tr_favorites enable row level security;
alter table tr_chats enable row level security;
alter table tr_messages enable row level security;

-- tr_profiles -----------------------------------------------
drop policy if exists "tr_profiles_select_all" on tr_profiles;
create policy "tr_profiles_select_all" on tr_profiles for select using (true);

drop policy if exists "tr_profiles_insert_own" on tr_profiles;
create policy "tr_profiles_insert_own" on tr_profiles for insert with check (auth.uid() = id);

drop policy if exists "tr_profiles_update_own" on tr_profiles;
create policy "tr_profiles_update_own" on tr_profiles for update using (auth.uid() = id);

-- tr_products -----------------------------------------------
drop policy if exists "tr_products_select_all" on tr_products;
create policy "tr_products_select_all" on tr_products for select using (true);

drop policy if exists "tr_products_insert_own" on tr_products;
create policy "tr_products_insert_own" on tr_products for insert with check (auth.uid() = user_id);

drop policy if exists "tr_products_update_own" on tr_products;
create policy "tr_products_update_own" on tr_products for update using (auth.uid() = user_id);

drop policy if exists "tr_products_delete_own" on tr_products;
create policy "tr_products_delete_own" on tr_products for delete using (auth.uid() = user_id);

-- tr_favorites ----------------------------------------------
drop policy if exists "tr_favorites_select_own" on tr_favorites;
create policy "tr_favorites_select_own" on tr_favorites for select using (auth.uid() = user_id);

drop policy if exists "tr_favorites_insert_own" on tr_favorites;
create policy "tr_favorites_insert_own" on tr_favorites for insert with check (auth.uid() = user_id);

drop policy if exists "tr_favorites_delete_own" on tr_favorites;
create policy "tr_favorites_delete_own" on tr_favorites for delete using (auth.uid() = user_id);

-- tr_chats --------------------------------------------------
drop policy if exists "tr_chats_select_participant" on tr_chats;
create policy "tr_chats_select_participant" on tr_chats for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

drop policy if exists "tr_chats_insert_buyer" on tr_chats;
create policy "tr_chats_insert_buyer" on tr_chats for insert
  with check (auth.uid() = buyer_id);

-- tr_messages -----------------------------------------------
drop policy if exists "tr_messages_select_participant" on tr_messages;
create policy "tr_messages_select_participant" on tr_messages for select
  using (
    exists (
      select 1 from tr_chats
      where tr_chats.id = tr_messages.chat_id
        and (tr_chats.buyer_id = auth.uid() or tr_chats.seller_id = auth.uid())
    )
  );

drop policy if exists "tr_messages_insert_participant" on tr_messages;
create policy "tr_messages_insert_participant" on tr_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from tr_chats
      where tr_chats.id = tr_messages.chat_id
        and (tr_chats.buyer_id = auth.uid() or tr_chats.seller_id = auth.uid())
    )
  );

-- ============================================================
-- 3. Storage — tr-product-images bucket
-- ============================================================
-- Run separately in Supabase Dashboard > Storage:
-- 1) Create bucket: tr-product-images (Public)
-- 2) Apply policies below in SQL Editor:

drop policy if exists "tr_product_images_read_all" on storage.objects;
create policy "tr_product_images_read_all" on storage.objects for select
  using (bucket_id = 'tr-product-images');

drop policy if exists "tr_product_images_insert_own" on storage.objects;
create policy "tr_product_images_insert_own" on storage.objects for insert
  with check (
    bucket_id = 'tr-product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "tr_product_images_delete_own" on storage.objects;
create policy "tr_product_images_delete_own" on storage.objects for delete
  using (
    bucket_id = 'tr-product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- 4. Profile auto-create trigger (on signup)
-- 기존 handle_new_user 함수·트리거와 분리 (handle_new_tr_user)
-- ============================================================

create or replace function public.handle_new_tr_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.tr_profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_tr on auth.users;
create trigger on_auth_user_created_tr
  after insert on auth.users
  for each row execute function public.handle_new_tr_user();
