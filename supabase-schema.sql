-- Hair Studio Milano — schema di produzione
-- Eseguire nel Supabase SQL Editor.
-- Non usa chiavi pubbliche per leggere/scrivere dati sensibili: l'app server usa la secret/service-role key.

create extension if not exists btree_gist;

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  service text not null,
  start_at timestamp without time zone not null,
  duration_minutes integer not null check (duration_minutes between 15 and 480),
  add_ons jsonb not null default '[]'::jsonb,
  estimated_total numeric(10,2) not null check (estimated_total >= 0),
  price_is_from boolean not null default false,
  privacy_consent boolean not null check (privacy_consent = true),
  privacy_consent_at timestamptz not null default now(),
  privacy_policy_version text not null default '1.0',
  status text not null default 'requested' check (status in ('requested','confirmed','cancelled')),
  source text not null default 'website'
);

create index if not exists booking_requests_start_at_idx
  on public.booking_requests (start_at);

create index if not exists booking_requests_status_start_at_idx
  on public.booking_requests (status, start_at);

-- Date/ora locali del salone, derivate da start_at.
alter table public.booking_requests
  add column if not exists date date generated always as (start_at::date) stored;

alter table public.booking_requests
  add column if not exists time time without time zone generated always as (start_at::time) stored;

create index if not exists booking_requests_date_idx
  on public.booking_requests (date);

-- Impedisce sovrapposizioni tra richieste attive, anche in caso di due richieste simultanee.
alter table public.booking_requests
  add column if not exists appointment_range tsrange
    generated always as (
      tsrange(
        start_at,
        start_at + make_interval(mins => duration_minutes),
        '[)'
      )
    ) stored;

alter table public.booking_requests
  drop constraint if exists booking_requests_no_overlap;

alter table public.booking_requests
  add constraint booking_requests_no_overlap
  exclude using gist (
    appointment_range with &&
  ) where (status in ('requested','confirmed'));

-- Dati sensibili: niente accesso diretto dal browser.
alter table public.booking_requests enable row level security;
revoke all on table public.booking_requests from anon, authenticated;
grant select, insert, update, delete on table public.booking_requests to service_role;

-- Rate limiting lato database: la chiave dell'IP non viene salvata in chiaro.
create table if not exists public.rate_limits (
  key_hash text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0)
);

create index if not exists rate_limits_window_started_idx
  on public.rate_limits (window_started_at);

alter table public.rate_limits enable row level security;
revoke all on table public.rate_limits from anon, authenticated;
grant select, insert, update, delete on table public.rate_limits to service_role;

create or replace function public.consume_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_started timestamptz;
  v_count integer;
  v_allowed boolean;
begin
  if p_limit < 1 or p_window_seconds < 1 then
    return false;
  end if;

  insert into public.rate_limits (key_hash, window_started_at, request_count)
  values (p_key, now(), 1)
  on conflict (key_hash) do update
    set
      request_count = case
        when public.rate_limits.window_started_at <= now() - (p_window_seconds || ' seconds')::interval
          then 1
        else public.rate_limits.request_count + 1
      end,
      window_started_at = case
        when public.rate_limits.window_started_at <= now() - (p_window_seconds || ' seconds')::interval
          then now()
        else public.rate_limits.window_started_at
      end
  returning window_started_at, request_count
  into v_started, v_count;

  v_allowed := v_count <= p_limit;
  return v_allowed;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;

-- Pulizia leggera delle chiavi vecchie. La si può eseguire manualmente dal SQL Editor.
delete from public.rate_limits
where window_started_at < now() - interval '7 days';
