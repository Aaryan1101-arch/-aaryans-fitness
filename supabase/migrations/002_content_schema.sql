-- ============================================================
-- Content management tables — replaces Sanity CMS
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- site_settings (singleton — only ever one row, id=1)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  id               int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name        text DEFAULT 'Aaryan''s Fitness Club',
  tagline          text DEFAULT 'The Aaryan''s Zone',
  logo_url         text,
  logo_stamp_url   text,
  phone_primary    text DEFAULT '+977 9851173983',
  phone_secondary  text DEFAULT '+977 9869636446',
  email            text DEFAULT 'theaaryansclub@gmail.com',
  address          text DEFAULT 'Pepsicola, Kathmandu, Nepal',
  map_url          text DEFAULT 'https://maps.app.goo.gl/hGjRzgwaAv9yaCsh6',
  map_embed_url    text DEFAULT 'https://maps.google.com/maps?width=100%25&height=600&hl=en&q=aryans%20fitness%20club+(Aaryan''s%20Fitness%20Club)&t=&z=17&ie=UTF8&iwloc=B&output=embed',
  facebook         text DEFAULT 'https://www.facebook.com/BaidhyaAnish?mibextid=ZbWKwL',
  instagram        text DEFAULT 'https://www.instagram.com/theaaryansfitnesszone/?igsh=MTM0eXdocnNiNTdybw%3D%3D',
  whatsapp         text DEFAULT '',
  footer_copyright text DEFAULT '© Aaryan''s Fitness Club. All Rights Reserved',
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_settings"  ON public.site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "admins_write_settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- hero_section (singleton)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.hero_section (
  id            int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  headline      text DEFAULT 'Aaryan''s Fitness Club',
  subheading    text DEFAULT 'At The Aaryan''s Zone, we do everything to help you become your best self.',
  cta_label     text DEFAULT 'Start Today',
  bg_image_url  text,
  tagline1      text DEFAULT 'Ditch the excuses, grab your motivation backpack!',
  tagline2      text DEFAULT '"Get Ready To Reach Your Fitness Goals"',
  why_us_title  text DEFAULT 'Why Choose Us?',
  why_us_items  jsonb DEFAULT '[
    {"title":"Modern Equipment","icon_url":null},
    {"title":"Healthy Nutrition","icon_url":null},
    {"title":"Expert Training","icon_url":null},
    {"title":"Tailored Package","icon_url":null}
  ]'::jsonb,
  updated_at    timestamptz DEFAULT now()
);

ALTER TABLE public.hero_section ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_hero"  ON public.hero_section FOR SELECT TO anon USING (true);
CREATE POLICY "admins_write_hero" ON public.hero_section FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.hero_section (id) VALUES (1) ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- membership_plans
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  price          text NOT NULL DEFAULT 'RS 0',
  is_popular     boolean DEFAULT false,
  features       jsonb DEFAULT '[]'::jsonb,
  sort_order     int DEFAULT 0,
  is_active      boolean DEFAULT true,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_plans"  ON public.membership_plans FOR SELECT TO anon USING (true);
CREATE POLICY "admins_write_plans" ON public.membership_plans FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER plans_updated_at BEFORE UPDATE ON public.membership_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.membership_plans (name, price, is_popular, features, sort_order) VALUES
  ('Bill Monthly',   'RS 3000',  false, '["Unlimited Gym Access","Aerobics","Kick Boxing","Cardio Boxing","Calisthenics"]'::jsonb, 1),
  ('Bill Quarterly', 'RS 14000', false, '["Unlimited Gym Access","Aerobics","Kick Boxing","Cardio Boxing","Calisthenics"]'::jsonb, 2),
  ('Bill Yearly',    'RS 25000', true,  '["Unlimited Gym Access","Aerobics","Kick Boxing","Cardio Boxing","Calisthenics"]'::jsonb, 3)
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- services
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  image_url      text,
  morning_hours  text DEFAULT '7 AM to 9 AM',
  evening_hours  text DEFAULT '6 PM to 8 PM',
  sort_order     int DEFAULT 0,
  is_active      boolean DEFAULT true,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_services"  ON public.services FOR SELECT TO anon USING (true);
CREATE POLICY "admins_write_services" ON public.services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.services (title, morning_hours, evening_hours, sort_order) VALUES
  ('Body Building',  '7 AM to 9 AM', '6 PM to 8 PM', 1),
  ('Aerobics',       '7 AM to 9 AM', '6 PM to 8 PM', 2),
  ('Kick Boxing',    '7 AM to 9 AM', '6 PM to 8 PM', 3),
  ('Cardio Boxing',  '7 AM to 9 AM', '6 PM to 8 PM', 4),
  ('Calisthenics',   '7 AM to 9 AM', '6 PM to 8 PM', 5),
  ('Zumba',          '7 AM to 9 AM', '6 PM to 8 PM', 6)
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- gallery_items
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url  text NOT NULL,
  caption    text DEFAULT '',
  category   text DEFAULT 'general',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_gallery"  ON public.gallery_items FOR SELECT TO anon USING (true);
CREATE POLICY "admins_write_gallery" ON public.gallery_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ────────────────────────────────────────────────────────────
-- team_members
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.team_members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  role       text DEFAULT '',
  bio        text DEFAULT '',
  photo_url  text,
  sort_order int DEFAULT 0,
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_team"  ON public.team_members FOR SELECT TO anon USING (true);
CREATE POLICY "admins_write_team" ON public.team_members FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ────────────────────────────────────────────────────────────
-- reviews
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  rating      int DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review      text DEFAULT '',
  photo_url   text,
  is_featured boolean DEFAULT true,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_reviews"  ON public.reviews FOR SELECT TO anon USING (true);
CREATE POLICY "admins_write_reviews" ON public.reviews FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.reviews (name, rating, review, is_featured, sort_order) VALUES
  ('Tania Andrew', 5, 'Amazing gym with great trainers and modern equipment. Highly recommend to anyone looking to get fit!', true, 1),
  ('Rohan Sharma', 5, 'Best gym in Pepsicola. The staff is very supportive and the environment is motivating.', true, 2)
ON CONFLICT DO NOTHING;
