-- ==============================================================================
-- ROUTEVECTOR: PRODUCTION SUPABASE LINK TRACKING SCHEMA
-- High Performance, ACID Compliant, Privacy-Conscious
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "pgcrypto";

-- 2. Links Table
create table if not exists public.links (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    destination_url text not null,
    title text,
    channel text,
    campaign text,
    clicks_count integer not null default 0,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    -- Constraints
    constraint code_length_check check (char_length(code) >= 2 and char_length(code) <= 64),
    constraint destination_url_format check (destination_url ~* '^https?://')
);

-- Ensure columns exist if table was already created
alter table public.links add column if not exists channel text;
alter table public.links add column if not exists campaign text;

-- 3. Clicks Table (Detailed Event Log)
create table if not exists public.clicks (
    id uuid primary key default gen_random_uuid(),
    link_id uuid not null references public.links(id) on delete cascade,
    short_code text not null,
    referer text,
    device text,
    browser text,
    os text,
    country text default 'Direct / Local',
    created_at timestamptz not null default now()
);

-- 4. High-Performance Indexes
create index if not exists idx_links_code on public.links(code);
create index if not exists idx_links_created_at on public.links(created_at desc);
create index if not exists idx_clicks_link_id on public.clicks(link_id);
create index if not exists idx_clicks_created_at on public.clicks(created_at desc);
create index if not exists idx_clicks_short_code on public.clicks(short_code);

-- 5. Trigger Function: Atomically Increment clicks_count
create or replace function public.handle_link_click_increment()
returns trigger as $$
begin
    update public.links
    set 
        clicks_count = clicks_count + 1,
        updated_at = now()
    where id = new.link_id;
    return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_click_increment_counter on public.clicks;
create trigger on_click_increment_counter
    after insert on public.clicks
    for each row
    execute function public.handle_link_click_increment();

-- 6. Row Level Security (RLS) Policies
alter table public.links enable row level security;
alter table public.clicks enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Allow public read-only resolution of active links" on public.links;
drop policy if exists "Allow service role full access on links" on public.links;
drop policy if exists "Allow service role full access on clicks" on public.clicks;

-- Public can only look up active links (needed for redirect resolution)
create policy "Allow public read-only resolution of active links"
    on public.links
    for select
    to anon, authenticated
    using (is_active = true);

-- Service role has full permissions for mutations (executed via server API endpoints)
create policy "Allow service role full access on links"
    on public.links
    for all
    to service_role
    using (true)
    with check (true);

-- Clicks table is strictly protected: Only the backend service role can log clicks or view logs
create policy "Allow service role full access on clicks"
    on public.clicks
    for all
    to service_role
    using (true)
    with check (true);

-- Optional: If using Supabase anon key without service role for local evaluation,
-- allow anon insert/read via controlled endpoints:
-- create policy "Allow anon insert clicks" on public.clicks for insert to anon with check (true);
-- create policy "Allow anon read clicks" on public.clicks for select to anon using (true);
