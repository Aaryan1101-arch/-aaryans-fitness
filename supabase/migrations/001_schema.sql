-- ============================================================
-- Aaryan's Fitness Club — Supabase schema
-- Run this entire file once in the Supabase SQL editor.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Helper: updated_at trigger
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ────────────────────────────────────────────────────────────
-- admins
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admins (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id      uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email        text UNIQUE NOT NULL,
  role         text NOT NULL DEFAULT 'staff'
                 CHECK (role IN ('owner','manager','staff','readonly')),
  created_at   timestamptz DEFAULT now(),
  last_seen_at timestamptz
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read their own admin row (to verify they're in the table)
CREATE POLICY "admin_read_own"
  ON public.admins FOR SELECT TO authenticated
  USING (auth_id = auth.uid());

-- Only owners can manage the admins list
CREATE POLICY "owner_manage_admins"
  ON public.admins FOR ALL TO authenticated
  USING  (EXISTS (SELECT 1 FROM public.admins WHERE auth_id = auth.uid() AND role = 'owner'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE auth_id = auth.uid() AND role = 'owner'));


-- ────────────────────────────────────────────────────────────
-- Helper functions (SECURITY DEFINER → bypass RLS)
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE auth_id = auth.uid())
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.current_admin_role()
RETURNS text AS $$
  SELECT role FROM public.admins WHERE auth_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ────────────────────────────────────────────────────────────
-- leads
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source      text NOT NULL DEFAULT 'contact_form',
  name        text NOT NULL,
  phone       text,
  email       text,
  message     text,
  status      text NOT NULL DEFAULT 'new'
                CHECK (status IN ('new','contacted','trialed','converted','lost')),
  assigned_to uuid REFERENCES public.admins(id),
  notes       text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Public (anon) can insert — the contact form writes here
CREATE POLICY "public_insert_leads"
  ON public.leads FOR INSERT TO anon
  WITH CHECK (true);

-- Authenticated admins get full access
CREATE POLICY "admins_all_leads"
  ON public.leads FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ────────────────────────────────────────────────────────────
-- members
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  phone      text UNIQUE,
  email      text,
  joined_on  date DEFAULT CURRENT_DATE,
  dob        date,
  gender     text,
  notes      text,
  status     text NOT NULL DEFAULT 'active'
               CHECK (status IN ('active','paused','cancelled','expired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_all_members"
  ON public.members FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE TRIGGER members_set_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ────────────────────────────────────────────────────────────
-- subscriptions
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id      uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  plan_name      text NOT NULL,
  plan_sanity_id text,
  start_date     date NOT NULL,
  end_date       date NOT NULL,
  amount_paid    numeric NOT NULL DEFAULT 0,
  currency       text NOT NULL DEFAULT 'NPR',
  status         text NOT NULL DEFAULT 'active'
                   CHECK (status IN ('pending','active','expired','cancelled')),
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_all_subscriptions"
  ON public.subscriptions FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ────────────────────────────────────────────────────────────
-- payments
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id       uuid NOT NULL REFERENCES public.members(id),
  subscription_id uuid REFERENCES public.subscriptions(id),
  amount          numeric NOT NULL,
  currency        text NOT NULL DEFAULT 'NPR',
  method          text NOT NULL DEFAULT 'cash'
                    CHECK (method IN ('cash','esewa','khalti','bank','stripe')),
  reference       text,
  paid_on         timestamptz DEFAULT now(),
  recorded_by     uuid REFERENCES public.admins(id),
  receipt_url     text
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Only manager+ can see payments
CREATE POLICY "managers_read_payments"
  ON public.payments FOR SELECT TO authenticated
  USING (public.current_admin_role() IN ('owner','manager'));

CREATE POLICY "managers_write_payments"
  ON public.payments FOR INSERT TO authenticated
  WITH CHECK (public.current_admin_role() IN ('owner','manager'));


-- ────────────────────────────────────────────────────────────
-- announcements
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.announcements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message     text NOT NULL,
  link_url    text,
  link_label  text,
  starts_at   timestamptz,
  ends_at     timestamptz,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Public can read active announcements
CREATE POLICY "public_read_announcements"
  ON public.announcements FOR SELECT TO anon
  USING (is_active = true AND (starts_at IS NULL OR starts_at <= now())
         AND (ends_at IS NULL OR ends_at > now()));

CREATE POLICY "admins_all_announcements"
  ON public.announcements FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ────────────────────────────────────────────────────────────
-- audit_log (append-only)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_log (
  id          bigserial PRIMARY KEY,
  admin_id    uuid REFERENCES public.admins(id),
  action      text NOT NULL,
  entity_type text,
  entity_id   text,
  before      jsonb,
  after       jsonb,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_read_audit"
  ON public.audit_log FOR SELECT TO authenticated
  USING (public.is_admin());

-- INSERT allowed, but no UPDATE or DELETE (append-only)
CREATE POLICY "admins_insert_audit"
  ON public.audit_log FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());


-- ────────────────────────────────────────────────────────────
-- Bootstrap: insert the first owner manually after running this.
-- In Supabase Dashboard → Authentication → Users → Invite user (your email)
-- Then run:
--   INSERT INTO public.admins (auth_id, email, role)
--   VALUES ('<paste auth.users.id here>', 'your@email.com', 'owner');
-- ────────────────────────────────────────────────────────────
