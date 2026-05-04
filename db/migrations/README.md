# Database migrations

These SQL files apply to the **Supabase** project that powers the live site.

## How to run a migration

1. Open your Supabase project dashboard.
2. Go to **Database → SQL Editor → New query**.
3. Paste the contents of the `.sql` file.
4. Click **Run**.

All migrations here are written to be idempotent (safe to re-run), so it's
fine to apply the latest one even if you're not sure where you left off.

## Files

### `2026-05-04_offers_supplements_notices.sql`
Adds three new content tables used by the public site and admin panel:

| Table         | Purpose                                                            |
| ------------- | ------------------------------------------------------------------ |
| `notices`     | Short messages shown in the top banner (holiday hours, etc.)       |
| `offers`      | Featured promotions shown in the top banner                        |
| `supplements` | Catalog of supplements available at the club (display-only)        |

Each table:
- Has `is_active` so the admin can hide rows without deleting them.
- Has `sort_order` for display ordering.
- `notices` and `offers` also have `starts_at` / `ends_at` for scheduled
  appearance (filtered both server-side, via `is_active`, and client-side,
  via the time window).
- Ships with row-level-security policies: anyone can read active rows;
  only authenticated admins can write.

After running, the new tables show up in the admin sidebar under
**Announcements** (Notices, Offers, Supplements). No code changes needed.

## Hosting checklist

For seamless deploys on **Vercel**:
1. Repository is already configured (`vercel.json` rewrites all paths to
   `index.html` so the `/admin/*` route works on refresh).
2. Set these env vars in Vercel → Project → Settings → Environment Variables
   (see `.env.example` at the repo root):
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_EMAILJS_*` (optional — for the contact form)
3. Push to `main` and Vercel rebuilds automatically.

## Storage bucket

The admin uploads photos via the `media` bucket in Supabase Storage. Make
sure that bucket exists and is **public** (Storage → media → settings).
The Gallery editor and the Offers/Supplements image upload both rely on it.
