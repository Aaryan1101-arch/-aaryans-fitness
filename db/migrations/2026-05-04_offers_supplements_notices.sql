-- ============================================================
-- Aaryan's Fitness — Offers, Supplements, Notices
-- Run this in the Supabase SQL editor (Database → SQL → "New query").
-- Idempotent: safe to re-run.
-- ============================================================

-- ---------- 1. NOTICES ----------
-- Short, dismissible messages shown in the top banner of the public site.
create table if not exists public.notices (
  id           bigserial primary key,
  message      text        not null,
  link_url     text,                                   -- optional CTA target
  link_label   text,                                   -- optional CTA text
  tone         text        not null default 'info',    -- 'info' | 'success' | 'warning' | 'danger'
  starts_at    timestamptz,                            -- show only after this
  ends_at      timestamptz,                            -- hide after this
  is_active    boolean     not null default true,
  sort_order   int         not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- 2. OFFERS ----------
-- Limited-time promotions. Surfaced in the top banner (and a dedicated section
-- if you want to add one later).
create table if not exists public.offers (
  id           bigserial primary key,
  title        text        not null,
  subtitle     text,
  description  text,
  badge        text,                                   -- "20% OFF", "NEW", etc.
  image_url    text,                                   -- optional poster image
  cta_label    text,
  cta_url      text,
  starts_at    timestamptz,
  ends_at      timestamptz,
  is_featured  boolean     not null default true,      -- featured offers go in the banner
  is_active    boolean     not null default true,
  sort_order   int         not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- 3. SUPPLEMENTS ----------
-- Catalog (display only — no purchase / inventory).
create table if not exists public.supplements (
  id            bigserial primary key,
  name          text        not null,
  brand         text,
  category      text        not null default 'general', -- protein | pre-workout | creatine | vitamin | general
  description   text,
  serving_info  text,                                   -- "30g per serving · 30 servings"
  price         text,                                   -- store as text to allow "RS 3,500"
  image_url     text,
  in_stock      boolean     not null default true,
  is_featured   boolean     not null default false,
  is_active     boolean     not null default true,
  sort_order    int         not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Speed up the common public-site queries.
create index if not exists idx_notices_active     on public.notices    (is_active, sort_order);
create index if not exists idx_offers_active      on public.offers     (is_active, is_featured, sort_order);
create index if not exists idx_supplements_active on public.supplements(is_active, sort_order);

-- ---------- 4. ROW LEVEL SECURITY ----------
-- Public can READ active rows; only authenticated admins can WRITE.
alter table public.notices     enable row level security;
alter table public.offers      enable row level security;
alter table public.supplements enable row level security;

-- Anonymous read of active rows (the public site uses the anon key)
drop policy if exists "notices_public_read"     on public.notices;
create policy "notices_public_read" on public.notices
  for select using (is_active = true);

drop policy if exists "offers_public_read"      on public.offers;
create policy "offers_public_read" on public.offers
  for select using (is_active = true);

drop policy if exists "supplements_public_read" on public.supplements;
create policy "supplements_public_read" on public.supplements
  for select using (is_active = true);

-- Authenticated users (admins) can do everything.
-- This matches the pattern your other content tables already use.
drop policy if exists "notices_admin_write"     on public.notices;
create policy "notices_admin_write" on public.notices
  for all using (auth.role() = 'authenticated')
       with check (auth.role() = 'authenticated');

drop policy if exists "offers_admin_write"      on public.offers;
create policy "offers_admin_write" on public.offers
  for all using (auth.role() = 'authenticated')
       with check (auth.role() = 'authenticated');

drop policy if exists "supplements_admin_write" on public.supplements;
create policy "supplements_admin_write" on public.supplements
  for all using (auth.role() = 'authenticated')
       with check (auth.role() = 'authenticated');

-- ---------- 5. updated_at TRIGGERS ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_touch_notices     on public.notices;
create trigger trg_touch_notices     before update on public.notices
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_touch_offers      on public.offers;
create trigger trg_touch_offers      before update on public.offers
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_touch_supplements on public.supplements;
create trigger trg_touch_supplements before update on public.supplements
  for each row execute function public.touch_updated_at();
