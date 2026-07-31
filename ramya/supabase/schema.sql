-- ============================================================
-- Vestique – Supabase Schema + RLS
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Profiles ────────────────────────────────────────────────
create table if not exists profiles (
  id uuid references auth.users primary key,
  full_name text,
  role text default 'customer' check (role in ('customer', 'designer')),
  created_at timestamp default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- ── Products ────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  category text not null,
  image_url text,
  designer_id uuid references profiles(id),
  created_at timestamp default now()
);

alter table products enable row level security;

create policy "Anyone can read products"
  on products for select using (true);

create policy "Designers can insert products"
  on products for insert
  with check (
    auth.uid() = designer_id and
    exists (select 1 from profiles where id = auth.uid() and role = 'designer')
  );

create policy "Designers can update own products"
  on products for update
  using (
    auth.uid() = designer_id and
    exists (select 1 from profiles where id = auth.uid() and role = 'designer')
  );

-- ── Wishlist ────────────────────────────────────────────────
create table if not exists wishlist (
  user_id uuid references profiles(id),
  product_id uuid references products(id),
  created_at timestamp default now(),
  primary key (user_id, product_id)
);

alter table wishlist enable row level security;

create policy "Users manage own wishlist"
  on wishlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Cart Items ──────────────────────────────────────────────
create table if not exists cart_items (
  user_id uuid references profiles(id),
  product_id uuid references products(id),
  quantity int default 1,
  primary key (user_id, product_id)
);

alter table cart_items enable row level security;

create policy "Users manage own cart"
  on cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Orders ──────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  status text default 'pending' check (status in ('pending','shipped','delivered')),
  total numeric not null,
  created_at timestamp default now()
);

alter table orders enable row level security;

create policy "Users manage own orders"
  on orders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Order Items ─────────────────────────────────────────────
create table if not exists order_items (
  order_id uuid references orders(id),
  product_id uuid references products(id),
  quantity int not null,
  price numeric not null,
  primary key (order_id, product_id)
);

alter table order_items enable row level security;

create policy "Users manage own order items"
  on order_items for all
  using (exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid()))
  with check (exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid()));

-- ── Reviews ─────────────────────────────────────────────────
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  product_id uuid references products(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamp default now(),
  unique (user_id, product_id)
);

alter table reviews enable row level security;

create policy "Anyone can read reviews"
  on reviews for select using (true);

create policy "Users can write own reviews"
  on reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete own reviews"
  on reviews for delete
  using (auth.uid() = user_id);

-- ── Coupons ──────────────────────────────────────────────────
create table if not exists coupons (
  code text primary key,
  discount_type text not null check (discount_type in ('flat', 'percent')),
  discount_value numeric not null,
  min_order numeric default 0,
  expires_at timestamp
);

-- Sample coupons (optional seed data)
insert into coupons (code, discount_type, discount_value, min_order) values
  ('WELCOME10', 'percent', 10, 0),
  ('FLAT200', 'flat', 200, 1000),
  ('FASHION20', 'percent', 20, 2000)
on conflict do nothing;

-- ── Storage: product-images bucket ─────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Designers upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images' and
    auth.role() = 'authenticated' and
    exists (select 1 from profiles where id = auth.uid() and role = 'designer')
  );
