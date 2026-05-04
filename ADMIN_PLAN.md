# Admin Backend — Master Plan

A grounded look at what your code already supports admin-editing, what it doesn't, and the cleanest path to a single admin surface that **controls everything** even after the site is live on Vercel.

---

## 1. Audit — what your code already does

### 1a. Frontend (React app, hosted on Vercel)

- Single-page React app. Sections: Hero, Services, Gallery, Team, Membership, Reviews, Contact, Footer.
- Every section reads from one of two sources at runtime:
  - **Sanity CMS** (live content) — fetched once on app load via `src/sanity/SiteContent.js`.
  - **Bundled fallback** — `src/sanity/fallbackContent.js`, used if Sanity is empty or unconfigured.
- Layered animations (framer-motion), lightbox, scroll-progress, mobile drawer, toast notifications. All purely visual.
- Contact form posts to **EmailJS** (`src/pages/Contact.js`) — message goes straight to your inbox via your Email Service template. Nothing is stored.

### 1b. Sanity Studio (admin you have today)

Lives in `studio/`, deployed separately to `<your-name>.sanity.studio`. Schemas in `studio/schemas/`:

| Schema | Type | Admin can do |
|---|---|---|
| `siteSettings` | Singleton | Edit name, tagline, logos, contact info, social links, footer text |
| `heroSection` | Singleton | Edit hero photo, headline, subheading, CTA text, "Why us" cards |
| `membershipPlan` | Collection | Create/edit/reorder plans, prices, features, "popular" badge |
| `service` | Collection | CRUD services + class hours |
| `galleryItem` | Collection | Upload photos, categorize, reorder |
| `teamMember` | Collection | CRUD trainers with photo, role |
| `review` | Collection | CRUD testimonials with rating |

**What this gives you:** total control of every visible word and image, with version history per document, magic-link login, free for life at this scale.

### 1c. Hosting

- Public site → Vercel free tier, auto-deploys on `git push`.
- Studio → Sanity hosting (free), `*.sanity.studio` URL.
- Form delivery → EmailJS free tier (200 messages/month).
- Total monthly cost today: **$0**.

---

## 2. What's missing if "everything" means everything

Things the current admin can NOT do post-deploy:

1. **See contact-form submissions.** They land in your inbox and disappear. No status, no follow-up workflow, no search.
2. **Track members.** Who has signed up? Which plan? When does it expire? Did they pay?
3. **Take bookings.** Visitors can read class times but can't reserve a slot.
4. **Record payments / send invoices.**
5. **Run promo codes or sale banners.**
6. **Send broadcast email/SMS** ("New strength class Saturday").
7. **See analytics** in one place — visits, conversions, top plans, trial-to-paid rate.
8. **Manage class schedule** beyond two static lines of "Morning / Evening".
9. **Audit log** — who changed what when, across content + data.
10. **Multi-admin roles** — your trainer can edit class times but not see revenue.
11. **Theme/branding sliders** — change colors, fonts, hero motion intensity from the admin (today these are in code).
12. **Per-section SEO** — custom meta + OG image per page or campaign.
13. **Blog or news posts.**

A "best admin that controls everything" needs to cover items 1–12. Blog (#13) is a future nice-to-have.

---

## 3. Architecture — the two-backend pattern

Mixing live data (members, bookings, payments) into Sanity is awkward. Mixing content (rich text, images, schemas that change weekly) into a SQL DB is awkward. The clean answer is **two specialized backends** behind one admin surface.

```
                    ┌──────────────────────────┐
                    │  Public website          │ ← visitors
                    │  React on Vercel         │
                    └──────┬──────────┬────────┘
                           │          │
                    reads  │          │  reads / writes (form submit, booking)
                           ▼          ▼
        ┌──────────────────────┐   ┌────────────────────────┐
        │  Sanity CMS          │   │  Supabase              │
        │  (content + media)   │   │  (Postgres + Auth +    │
        │  CDN-cached          │   │   Storage + Realtime)  │
        └──────┬───────────────┘   └──────┬─────────────────┘
               │ writes (Sanity Studio)   │ writes
               │                          ▼
               │              ┌────────────────────────────┐
               └──────────────│   /admin route in React    │
                              │   (Vercel, magic-link auth)│
                              └──────────────┬─────────────┘
                                             │
                                       admin user
```

| Concern | Lives in |
|---|---|
| Hero photo, plan prices, copy, gallery, team | Sanity |
| Lead inbox, members, bookings, payments, coupons | Supabase |
| Login (admin) | Supabase Auth |
| Visual design tokens | Sanity (`themeSettings` doc) |
| Audit log of admin actions | Supabase |
| Public form submissions | Supabase **and** EmailJS notification (so you both get the email AND have a queryable record) |

### Why Supabase (vs Firebase, Strapi, custom Node)
- **Postgres**, so you can model real relationships (member → subscription → payments).
- **Built-in magic-link auth** + role claims — same UX as Sanity.
- **Row-level security** — declarative permissions, no admin endpoint bugs leaking data.
- **Storage + Realtime + Edge Functions** included.
- Free tier comfortably covers a single-gym site for years.
- Open-source — you can self-host later if you ever outgrow it.

---

## 4. The unified admin UI — `/admin`

A protected route inside the same React app, code-split so the public bundle stays tiny.

```
/                         ← public site (today)
/admin                    ← admin dashboard (new)
/admin/leads              ← inbox of contact-form submissions
/admin/members            ← member directory + filters
/admin/members/:id        ← member profile, plan history, notes
/admin/bookings           ← upcoming bookings, walk-ins
/admin/schedule           ← editable weekly class grid
/admin/payments           ← payments ledger, mark-as-paid, receipt PDF
/admin/coupons            ← create/disable promo codes
/admin/announcements      ← site-wide banner editor
/admin/analytics          ← traffic, conversions, plan mix
/admin/audit              ← who changed what when
/admin/settings           ← admin user list, roles, integrations
/admin/content → opens Sanity Studio in a new tab
```

Stack inside `/admin` (mostly things already in the project):

- React Router v6 — already installed.
- `@supabase/supabase-js` for data + auth.
- `react-hook-form` + `zod` for forms with validation.
- `@tanstack/react-table` for data grids.
- `recharts` for analytics charts (lightweight — already familiar).
- `date-fns` for dates.
- Reuse the existing Tailwind tokens (`brand`, `ink-*`, `glass-card`) so the admin feels native to the brand.

---

## 5. Data model (Supabase / Postgres)

Sketch only — column types simplified.

```sql
-- Admin users. Email + role. Auth itself is handled by Supabase Auth.
admins (
  id uuid pk, email text unique,
  role text check in ('owner','manager','staff','readonly'),
  created_at timestamptz, last_seen_at timestamptz
)

-- Public form submissions and other inbound interest.
leads (
  id uuid pk, source text, -- 'contact_form' | 'whatsapp' | 'walk_in'
  name text, phone text, email text, message text,
  status text default 'new', -- 'new' | 'contacted' | 'trialed' | 'converted' | 'lost'
  assigned_to uuid -> admins.id,
  created_at timestamptz, updated_at timestamptz, notes jsonb
)

-- People who have signed up.
members (
  id uuid pk, name text, phone text unique, email text,
  joined_on date, dob date, gender text,
  emergency_contact text, photo_url text,
  status text default 'active', -- 'active' | 'paused' | 'cancelled' | 'expired'
  created_at timestamptz
)

-- A subscription = member on a specific plan for a window.
subscriptions (
  id uuid pk, member_id -> members.id,
  plan_sanity_id text, -- references the Sanity membershipPlan ID
  start_date date, end_date date,
  amount_paid numeric, currency text default 'NPR',
  status text -- 'pending' | 'active' | 'expired' | 'cancelled'
)

-- Each payment line item.
payments (
  id uuid pk, member_id, subscription_id,
  amount numeric, currency text, method text, -- 'cash' | 'esewa' | 'khalti' | 'bank' | 'stripe'
  reference text, paid_on timestamptz,
  recorded_by -> admins.id, receipt_url text
)

-- Recurring weekly class slots.
classes (
  id uuid pk, name text, instructor_id -> teamMember (sanity id),
  day_of_week int, start_time time, end_time time,
  capacity int, is_active boolean
)

-- Bookings made by members or walk-ins.
class_bookings (
  id uuid pk, class_id -> classes.id, member_id nullable,
  guest_name text nullable, guest_phone text nullable,
  date date, status text -- 'booked' | 'attended' | 'no_show' | 'cancelled'
)

-- Promo codes.
coupons (
  id uuid pk, code text unique, description text,
  percent_off int nullable, amount_off numeric nullable,
  starts_on date, ends_on date, max_uses int nullable, used_count int default 0,
  is_active boolean
)

-- Site-wide announcement banner.
announcements (
  id uuid pk, message text, link_url text, link_label text,
  starts_at timestamptz, ends_at timestamptz, is_active boolean
)

-- Tamper-evident log of admin actions.
audit_log (
  id bigserial pk, admin_id -> admins.id,
  action text, -- 'lead.update_status' | 'member.create' | 'plan.delete'
  entity_type text, entity_id text,
  before jsonb, after jsonb, created_at timestamptz
)
```

Row-level-security policies (in plain English):
- Anyone can `INSERT` into `leads` (so the public contact form works), but only admins can `SELECT` / `UPDATE` / `DELETE`.
- Only `owner` and `manager` can read `payments`. `staff` cannot.
- Only `owner` can change `admins`.
- Audit log is append-only — even owners can't delete rows.

---

## 6. Auth model

- Admin signs in at `/admin/login` with email → magic link from Supabase.
- Email must be in the `admins` table — otherwise login is rejected.
- JWT carries the admin's `role`. Frontend hides what they shouldn't see; RLS enforces it on the server too.
- First admin (you) is bootstrapped via the Supabase dashboard. Subsequent admins are added from `/admin/settings/team` by an owner.

---

## 7. Phased delivery — what to build, in what order

Each phase is independently shippable. You can stop after any of them.

### Phase 0 — Done
Sanity content admin. ✓

### Phase 1 — Lead inbox (~1–2 days)
**Why first:** highest immediate value; replaces "form submissions vanish into email" with a queryable workflow.
- Supabase project, schema `admins` + `leads` + RLS.
- `/admin/login` (magic link) + auth guard.
- `/admin/leads` table: filter by status, click-to-call, mark contacted.
- `Contact.js` writes to Supabase `leads` AND still fires EmailJS notification.
- Daily email digest (Supabase Edge Function on cron).

### Phase 2 — Members & subscriptions (~2–3 days)
- `members`, `subscriptions`, `payments` tables.
- `/admin/members` directory + `/admin/members/:id` profile.
- "Add new member" wizard that also captures first payment.
- Expiry alerts widget on dashboard ("12 plans expire next week").
- Per-member subscription history & total spend.

### Phase 3 — Class schedule + bookings (~2–3 days)
- `classes` + `class_bookings`.
- `/admin/schedule` editable weekly grid (drag to add a class).
- Public site gains a "Book a class" widget on the Services section that talks to Supabase.
- `/admin/bookings` for today / tomorrow with attendance check-off.

### Phase 4 — Coupons, announcements, analytics, audit (~2 days)
- Coupon CRUD + "apply at checkout" hook for Phase 5.
- Announcement bar editor; bar appears on public site if active.
- `/admin/analytics`: leads/week, conversion %, revenue/month, top plan. Recharts.
- `/admin/audit` viewer — read-only audit_log with filters.

### Phase 5 — Online payments (Stripe / eSewa / Khalti) (~3–5 days)
- "Pay online" button on Membership cards.
- Webhook → Supabase records `payments` and updates subscription `status` to `active`.
- Auto-receipt PDF emailed to the member.

### Phase 6 — Communications (~2 days)
- Outbound email/SMS broadcast composer (Resend or Twilio).
- Pre-built segments: "expiring this month", "new leads last 7 days".
- Per-member message log.

### Phase 7 — Theme + SEO controls (~1 day)
- New Sanity singleton `themeSettings`: brand color, accent, hero motion intensity, default OG image.
- React app reads it on load, sets CSS variables.
- Per-section SEO doc in Sanity for OG/meta overrides.

### Stretch — Blog, member-facing portal, native app
Future, not in scope for "single admin that controls everything".

---

## 8. Cost & ongoing maintenance

| Resource | Free tier | Likely usage | Cost |
|---|---|---|---|
| Vercel | 100 GB bandwidth, unlimited builds | A small-town gym site: ~5 GB/mo | $0 |
| Sanity | 10k docs, 5GB assets, 3 users | A few hundred docs + 1 GB photos | $0 |
| Supabase | 500MB DB, 1GB storage, 50k monthly auth users | 1k members × ~10KB + photos | $0 (years of headroom) |
| EmailJS | 200 emails/month | If you also write to Supabase, drop to "send only when admin opts in" | $0 |
| Stripe (Phase 5) | Pay-per-transaction, no monthly | 2.9% + Rs 30 per charge | per-txn only |

Realistic total: **$0/month** until you hit ~10k members or unusually heavy traffic.

Ongoing maintenance (~30 min/month):
- Glance at Supabase usage in dashboard.
- Approve `npm audit` security PRs (set up Dependabot — free).
- Daily-ish: triage `/admin/leads` (the actual workflow, not maintenance).

---

## 9. Deployment changes

Adding to what you already have:

1. **New Vercel env vars:**
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
2. **Code split** the admin bundle: `const Admin = React.lazy(() => import('./admin'))` so visitors don't download admin code.
3. **Supabase migrations** live in a `/supabase/migrations` folder, run on deploy via the Supabase CLI (or manually for the first cut).
4. **GitHub Action** (free) to run `supabase db push` on `main`.
5. **Sanity → Supabase reference linkage**: when an admin deletes a Sanity plan, the cron Edge Function flags any `subscriptions` referencing it. Soft sync, not hard FKs (cross-system).

---

## 10. Risks & how to mitigate

| Risk | Mitigation |
|---|---|
| Someone discovers `/admin` URL | Auth blocks them. Optionally rename route after launch. Add basic-auth at Vercel for extra layer. |
| Public form spam | Honeypot + rate-limit (Supabase Edge Function with simple IP throttle) + reCAPTCHA invisible v3. |
| RLS misconfiguration leaking data | Write integration tests that assert non-admin can't read `payments`. Easy with Supabase test client. |
| Supabase outage | Sanity-driven content remains visible (most of the site). Form failure → fall back to mailto link. |
| Admin loses laptop | Magic-link auth = nothing on disk to steal. Owner can revoke their `admins` row instantly. |
| Cost surprise | Set Supabase usage alerts at 50% and 80% of free-tier limits. |
| Schema drift between code and DB | Migrations checked into git, applied via CI, drift checked in PR. |

---

## 11. What I recommend you do next

1. **Ship what's already built** (Sanity + Vercel) — value today, no waiting.
2. **Phase 1 (lead inbox)** is the single highest-leverage addition. ~1–2 days of work, immediately changes how you run the gym.
3. **Phase 2 (members)** is what turns this from "marketing site" into "small business OS".
4. Phases 3–7 in whatever order pain dictates. Don't build them speculatively.

When you want to start a phase, tell me which and I'll scaffold it: schema migrations, RLS policies, the admin route, the public-side hooks, and updates to `DEPLOY.md`.
