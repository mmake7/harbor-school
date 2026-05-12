-- ============================================================
-- today-room (오늘의집 클론) — DB 스키마 + RLS
-- Supabase SQL Editor에서 그대로 실행
-- ============================================================

-- ============================================================
-- 1. Tables
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  neighborhood text,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  price integer not null,
  description text,
  category text not null check (category in ('furniture','lighting','accessory','fabric','plant')),
  images text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists products_category_idx on products (category);
create index if not exists products_created_desc_idx on products (created_at desc);

create table if not exists favorites (
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, product_id)
);

create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  buyer_id uuid not null references profiles(id),
  seller_id uuid not null references profiles(id),
  created_at timestamptz default now(),
  unique (product_id, buyer_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references chats(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists messages_chat_time_idx on messages (chat_id, created_at);

-- ============================================================
-- 2. RLS — enable on all tables
-- ============================================================

alter table profiles enable row level security;
alter table products enable row level security;
alter table favorites enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;

-- profiles ---------------------------------------------------
drop policy if exists "profiles_select_all" on profiles;
create policy "profiles_select_all" on profiles for select using (true);

drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- products ---------------------------------------------------
drop policy if exists "products_select_all" on products;
create policy "products_select_all" on products for select using (true);

drop policy if exists "products_insert_own" on products;
create policy "products_insert_own" on products for insert with check (auth.uid() = user_id);

drop policy if exists "products_update_own" on products;
create policy "products_update_own" on products for update using (auth.uid() = user_id);

drop policy if exists "products_delete_own" on products;
create policy "products_delete_own" on products for delete using (auth.uid() = user_id);

-- favorites --------------------------------------------------
drop policy if exists "favorites_select_own" on favorites;
create policy "favorites_select_own" on favorites for select using (auth.uid() = user_id);

drop policy if exists "favorites_insert_own" on favorites;
create policy "favorites_insert_own" on favorites for insert with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on favorites;
create policy "favorites_delete_own" on favorites for delete using (auth.uid() = user_id);

-- chats ------------------------------------------------------
drop policy if exists "chats_select_participant" on chats;
create policy "chats_select_participant" on chats for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

drop policy if exists "chats_insert_buyer" on chats;
create policy "chats_insert_buyer" on chats for insert
  with check (auth.uid() = buyer_id);

-- messages ---------------------------------------------------
drop policy if exists "messages_select_participant" on messages;
create policy "messages_select_participant" on messages for select
  using (
    exists (
      select 1 from chats
      where chats.id = messages.chat_id
        and (chats.buyer_id = auth.uid() or chats.seller_id = auth.uid())
    )
  );

drop policy if exists "messages_insert_participant" on messages;
create policy "messages_insert_participant" on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from chats
      where chats.id = messages.chat_id
        and (chats.buyer_id = auth.uid() or chats.seller_id = auth.uid())
    )
  );

-- ============================================================
-- 3. Storage — product-images bucket
-- ============================================================
-- Run separately in Supabase Dashboard > Storage:
-- 1) Create bucket: product-images (Public)
-- 2) Apply policies below in SQL Editor:

-- public read on product-images
drop policy if exists "product_images_read_all" on storage.objects;
create policy "product_images_read_all" on storage.objects for select
  using (bucket_id = 'product-images');

-- authenticated users can upload to their own folder
drop policy if exists "product_images_insert_own" on storage.objects;
create policy "product_images_insert_own" on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- authenticated users can delete their own
drop policy if exists "product_images_delete_own" on storage.objects;
create policy "product_images_delete_own" on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- 4. Profile auto-create trigger (on signup)
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
