create table if not exists public.finance_data (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.finance_data enable row level security;

-- No public policies are needed.
-- The Vercel API uses SUPABASE_SERVICE_ROLE_KEY privately on the server.
