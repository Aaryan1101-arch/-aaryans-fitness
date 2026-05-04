# Deploying to Netlify

This guide takes the recent changes (offers, supplements, notices, top banner,
gallery improvements) live on your existing Netlify site.

If your Netlify site is already connected to this Git repo, the workflow is:

1. Run **one Supabase SQL migration** (5 minutes, one-time)
2. Confirm **environment variables** in Netlify
3. Push to your main branch — Netlify auto-builds and deploys

That's it. Detailed steps below.

---

## 1. Run the Supabase migration (required, one-time)

The new admin pages won't work until the three new tables exist in your
Supabase database.

1. Go to <https://supabase.com> → your project → **SQL Editor** → **New query**.
2. Open `db/migrations/2026-05-04_offers_supplements_notices.sql` from this
   repo.
3. Copy the whole file, paste into the SQL editor, click **Run**.
4. You should see "Success. No rows returned." That's expected — it just
   created tables, not data.

The migration is idempotent (uses `create table if not exists` and
`drop policy if exists` everywhere), so re-running it is safe.

**What it creates:**

- `notices` — short messages for the top banner
- `offers` — promotions for the top banner
- `supplements` — catalog of supplements
- Row-level security policies so the public anon key can only read active rows
- Indexes and `updated_at` triggers

---

## 2. Confirm your Supabase Storage bucket

The admin uploads images via the `media` bucket. You probably already have
this since the existing Gallery editor uses it, but worth checking:

1. Supabase → **Storage** → look for a bucket named `media`.
2. If it's not there, click **New bucket** → name it `media` → mark it
   **Public**.
3. If it exists but is private, open it → **Settings** → toggle **Public**.

Without a public `media` bucket, image uploads in Offers / Supplements editors
will succeed but the public site won't be able to display them.

---

## 3. Set environment variables in Netlify

These are the same vars the site already uses — you only need to verify
they're present, not change anything.

1. Netlify dashboard → your site → **Site configuration** → **Environment
   variables**.
2. Make sure these exist (values from Supabase → Settings → API):

   | Key                          | Value                                           |
   | ---------------------------- | ----------------------------------------------- |
   | `REACT_APP_SUPABASE_URL`     | Your Supabase project URL (`https://xxxx.supabase.co`) |
   | `REACT_APP_SUPABASE_ANON_KEY`| The `anon` `public` key                         |

3. Optional, only if your contact form uses EmailJS:

   | Key                              | Value                  |
   | -------------------------------- | ---------------------- |
   | `REACT_APP_EMAILJS_SERVICE_ID`   | from emailjs.com       |
   | `REACT_APP_EMAILJS_TEMPLATE_ID`  | from emailjs.com       |
   | `REACT_APP_EMAILJS_PUBLIC_KEY`   | from emailjs.com       |

   Without EmailJS vars the contact form gracefully falls back to direct
   phone/email links — no error, just no in-page form submit.

4. If you change any var, Netlify needs a fresh build to pick it up.
   Trigger one from **Deploys → Trigger deploy → Clear cache and deploy site**.

---

## 4. Push the code

If your repo is connected to Netlify (which it is, since `netlify.toml` is
present):

```bash
git add .
git commit -m "Add offers, supplements, notices + top banner"
git push
```

Netlify detects the push and starts a build automatically. Watch the
**Deploys** tab — a green check means it's live.

If you're uploading manually (drag-and-drop):

```bash
npm run build
# then drag the build/ folder onto the Netlify dashboard
```

---

## 5. First-time? Connect the repo to Netlify

Skip this if Netlify is already wired up.

1. Push the repo to GitHub (or GitLab / Bitbucket) if it isn't already.
2. Netlify → **Add new site** → **Import an existing project** → pick the repo.
3. Build settings (Netlify reads `netlify.toml`, so leave defaults):
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
4. Add the env vars from step 3 before the first build.
5. Click **Deploy**.

---

## 6. Verify the deploy

Once Netlify says "Published":

1. Open the site URL.
2. **Public site sanity check:**
   - The page loads, hero shows, all existing sections still render.
   - No top banner is visible (you haven't added any notices/offers yet — that's correct).
   - No "Supplements" link in the navbar (catalog is empty — correct).
3. **Admin sanity check:**
   - Go to `/admin` on the deployed URL → log in.
   - Sidebar shows a new **Announcements** group: Notices, Offers, Supplements.
   - Open each one — they should load with an empty state message ("No notices yet…").
4. **End-to-end test:**
   - Add a notice (e.g. "Test announcement").
   - Reload the public site — the top banner appears with your notice.
   - Click the × to dismiss; refresh the same browser tab — it stays dismissed
     (per session). Open in a private window — banner shows again. ✓

---

## 7. Modifications already made for Netlify

Nothing for you to do here — listing for completeness. The repo already had
or now has:

- `netlify.toml` — build command, publish dir, Node 20, SPA redirects, cache
  headers for `/static/*` and `/images/*`. The `CI = "false"` line is set so
  CRA's "warnings as errors" behaviour doesn't fail the build on a stray
  ESLint warning.
- `public/_redirects` — backup SPA fallback (`/*  /index.html  200`).
- `.nvmrc` — pins Node 20 locally to match Netlify.
- `vercel.json` — kept in repo for reference but **Netlify ignores it**. You
  can delete it if you've fully migrated off Vercel.

If you ever change the build output directory or framework, update both
`netlify.toml` and `vercel.json` (or just delete the unused one).

---

## Troubleshooting

**"Page not found" when visiting `/admin` directly**
→ The SPA redirect isn't working. Confirm `netlify.toml` is at repo root, not
inside a subfolder. Try a hard rebuild (Deploys → Trigger deploy → Clear
cache and deploy site).

**Admin loads but every editor says "Loading…" forever**
→ Supabase env vars are missing or wrong on Netlify. Check the browser
console (F12) — you'll see network errors against an empty URL.

**"Could not find the table 'public.notices'"**
→ You skipped step 1. Run the SQL migration.

**Image upload in Offers/Supplements editor fails with "Bucket not found"**
→ Step 2: create or unprivate the `media` bucket in Supabase Storage.

**Top banner shows but text is unreadable on mobile**
→ Long messages overflow. Edit the notice and shorten it; the banner truncates
single-line content with an ellipsis.

**Build fails with "Treating warnings as errors"**
→ Already mitigated by `CI = "false"` in `netlify.toml`. If you still see it,
make sure the env var section in `netlify.toml` was saved.

---

## What changed in this release

For your reference / changelog purposes:

- **New tables:** `notices`, `offers`, `supplements` (with RLS, indexes, triggers)
- **New public components:**
  - `src/components/TopBanner.js` — dismissible banner that cycles through active notices and featured offers
  - `src/pages/Supplements.js` — display-only supplements catalog with filter pills, snap-scroll on mobile
- **New admin editors:**
  - `/admin/content/notices` — manage banner notices
  - `/admin/content/offers` — manage promotions
  - `/admin/content/supplements` — manage the catalog
- **Polished:** Gallery editor now supports bulk select & delete, reorder buttons, and cleans up storage on delete
- **Polished:** Sidebar uses semantically correct icons (megaphone for notices, beaker for supplements)
- **Polished:** Navbar auto-hides the Supplements link when the catalog is empty
