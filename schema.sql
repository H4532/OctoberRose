-- Run on a DEDICATED Supabase project using the SQL Editor.
create table if not exists public.october_rose_registrations (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 full_name text not null,
 email text not null,
 phone text,
 city text default 'Jeddah',
 organization text,
 num_guests integer not null default 1 check (num_guests between 1 and 10),
 message text,
 consent boolean not null default false
);
alter table public.october_rose_registrations enable row level security;
-- Do not add anon access policies. Only the secure Next.js server has the service role key.
create index if not exists idx_october_rose_created on public.october_rose_registrations(created_at desc);
