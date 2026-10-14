-- Skema Supabase untuk CodeShark Academy (multi-user + Google login).
-- Jalankan di Supabase SQL Editor. Tabel memakai user_id = auth.users.id (RLS owner-only).
-- Guest lokal tetap jalan tanpa login; saat login, deviceId lama di-link ke user_id.

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  device_id text,
  name text not null,
  age text not null default 'teen',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists saves (
  user_id uuid primary key references profiles(user_id) on delete cascade,
  xp integer not null default 0,
  coins integer not null default 0,
  modules jsonb not null default '{}'::jsonb,
  stats jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists attempts (
  id text primary key,
  user_id uuid not null references profiles(user_id) on delete cascade,
  device_id text,
  session_id text not null,
  won boolean not null default false,
  stars integer not null default 0,
  score integer not null default 0,
  accuracy numeric not null default 0,
  wpm numeric not null default 0,
  max_combo integer not null default 0,
  xp_award integer not null default 0,
  coins_award integer not null default 0,
  passed boolean not null default false,
  played_at timestamptz not null default now()
);

create index if not exists attempts_user_idx on attempts(user_id, played_at desc);

alter table profiles enable row level security;
alter table saves enable row level security;
alter table attempts enable row level security;

drop policy if exists "owner_all_profiles" on profiles;
create policy "owner_all_profiles" on profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "owner_all_saves" on saves;
create policy "owner_all_saves" on saves
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "owner_all_attempts" on attempts;
create policy "owner_all_attempts" on attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
