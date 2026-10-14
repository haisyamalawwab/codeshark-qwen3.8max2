-- Skema NeonDB (Postgres serverless) untuk CodeShark Academy.
-- Jalankan sekali via Neon SQL Editor / psql $DATABASE_URL -f db/schema.sql

create table if not exists profiles (
  device_id text primary key,
  name text not null,
  age text not null default 'teen',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists saves (
  device_id text primary key references profiles(device_id) on delete cascade,
  xp integer not null default 0,
  coins integer not null default 0,
  modules jsonb not null default '{}'::jsonb,
  stats jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists attempts (
  id text primary key,
  device_id text not null references profiles(device_id) on delete cascade,
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

create index if not exists attempts_device_idx on attempts(device_id, played_at desc);
