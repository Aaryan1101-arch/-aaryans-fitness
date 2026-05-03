# Hosting, Admin Panel & Maintenance Guide

## What you're getting

Two free-tier services that work together. Both are zero-maintenance once set up.

| URL | What it is | Who uses it |
|---|---|---|
| `https://aaryans-fitness.vercel.app` | Public website. Static, fast, on a global CDN. | Visitors. |
| `https://aaryans-fitness.sanity.studio` | Admin panel. Edit photos, prices, plans, etc. | You (and anyone you invite). |

**How edits flow:** You log into the studio with a magic link, edit content, click Publish. The website re-fetches the new content within 30 seconds. No rebuild, no `git push`, no Vercel involvement.

**When code changes (rare):** Edit a file → `git push` → Vercel auto-rebuilds in ~1 min.

---

## One-time setup (~30 minutes total)

### Part A — Spin up the Sanity admin panel

```bash
cd ~/Desktop/gym/studio
npm install
npx sanity init --env
```

When it asks:

- **Login method:** pick Email/Password or Google. Use whichever address you want admin access from.
- **Create new project?** Yes.
- **Project name:** `aaryans-fitness`.
- **Dataset name:** press Enter (defaults to `production`).
- **Output path:** press Enter.

It writes a file `studio/.env` with a line like `SANITY_STUDIO_PROJECT_ID=abc123xy`. **Copy that project ID** — you'll need it twice more.

Then deploy the studio so it lives on the public internet:

```bash
npx sanity deploy
# When prompted, pick a hostname: aaryans-fitness
# (or whatever — must be unique on sanity.studio)
```

When it finishes you'll see:
```
Studio deployed to: https://aaryans-fitness.sanity.studio
```

That's your admin URL. Bookmark it.

### Part B — Push the React app to GitHub

```bash
cd ~/Desktop/gym
git init
git add -A
git commit -m "CMS-driven site"
```

Then create an empty repo on <https://github.com/new> (no README/license/.gitignore — we have those). Copy the URL it shows, then:

```bash
git remote add origin https://github.com/<your-username>/aaryans-fitness.git
git push -u origin main
```

### Part C — Connect the repo to Vercel

1. Sign in to <https://vercel.com/signup> with your GitHub account.
2. **Add New → Project** → find `aaryans-fitness` → **Import**.
3. Vercel auto-detects Create React App. **Don't change build settings.**
4. Expand **Environment Variables** and add two:

   | Name | Value |
   |---|---|
   | `REACT_APP_SANITY_PROJECT_ID` | the project ID from Part A |
   | `REACT_APP_SANITY_DATASET` | `production` |

5. Click **Deploy**. ~1–2 minutes later you'll have a URL like `https://aaryans-fitness.vercel.app`.

### Part D — Test the loop

1. Open `https://aaryans-fitness.sanity.studio` and log in.
2. Click **Site Settings** → fill in name, tagline, contact info → **Publish**.
3. Open `https://aaryans-fitness.vercel.app`, hard-refresh (Cmd+Shift+R). The new info should be there.
4. Same drill for **Hero / Landing** (upload a new background photo) and **Membership Plans** (create three plans, mark one Popular).

If a section in Sanity is empty, the site falls back to the original bundled content. Nothing ever shows blank.

---

## Day-to-day admin

### Change a price, photo, or plan

1. Go to `https://aaryans-fitness.sanity.studio` (it remembers your login).
2. Click the section, edit, **Publish**.
3. Refresh the public site after ~30 seconds.

### Add a new team member / gallery photo / review

1. Studio → click the collection (e.g. "Gallery Photos") → **Create**.
2. Fill in fields, **Publish**. New item appears immediately.

### Reorder items in a list

Each plan / gallery photo / team member has an **Order** field (lower = first). Edit the number, publish, refresh.

### Invite another admin

Studio dashboard → top right avatar → **Manage project** → **Members** → **Invite member** → enter their email → they'll get a login link.

---

## Day-to-day code (rare)

Only needed if you want to change the layout, colors, or add a new section type.

```bash
cd ~/Desktop/gym
# edit files
git add -A
git commit -m "describe what you changed"
git push
```

Vercel sees the push, rebuilds automatically. Site updates in ~1 minute.

### Local dev with the live CMS

```bash
cd ~/Desktop/gym
echo "REACT_APP_SANITY_PROJECT_ID=YOUR_ID_HERE" > .env.local
echo "REACT_APP_SANITY_DATASET=production" >> .env.local
npm install
npm start    # opens http://localhost:3000
```

Edits in studio appear locally on refresh. Code changes hot-reload.

### Updating the studio (e.g. add a new field type)

```bash
cd ~/Desktop/gym/studio
# edit the appropriate file in studio/schemas/
npx sanity deploy
```

Studio updates within seconds. No need to redeploy the website unless you also changed how that field is rendered in `src/`.

---

## What you do NOT have to maintain

- **HTTPS / SSL** — both Vercel and Sanity Studio handle it automatically and renew forever.
- **Server uptime** — there is no server. Static files are on Vercel's CDN; CMS is on Sanity's CDN.
- **Database backups** — Sanity keeps full version history of every document forever (free tier).
- **DNS** — `*.vercel.app` and `*.sanity.studio` subdomains are permanent and free.

---

## If you want a custom domain (e.g. `aaryansfitness.com`)

1. Vercel dashboard → project → **Settings → Domains → Add**.
2. Enter your domain, copy the DNS records Vercel shows, paste them at your registrar (Namecheap, GoDaddy, Cloudflare, etc.).
3. SSL provisions automatically in a few minutes.

You don't need a custom domain for the studio — `*.sanity.studio` is fine for an admin URL.

---

## Troubleshooting

**Site shows the old default content even after editing in Sanity.** Hard-refresh (Cmd+Shift+R). Sanity's CDN caches for ~30 seconds.

**Everything looks empty / missing photos.** Check that both Vercel env vars (`REACT_APP_SANITY_PROJECT_ID` and `REACT_APP_SANITY_DATASET`) are set, then trigger a redeploy: Vercel dashboard → Deployments → ⋯ → Redeploy. Env-var changes need a rebuild to take effect.

**Vercel build fails.** Click the failed deployment → read the log. Most failures are syntax errors in a recent edit. Fix locally, `git push`, Vercel retries.

**I broke the public site with a bad edit.** Vercel keeps every previous build. Dashboard → Deployments → find a working one → ⋯ → **Promote to Production**. Live in ~10 seconds.

**Studio won't load.** Check `https://www.sanity.io/manage` — make sure the project still exists. Re-run `npx sanity deploy` from `studio/` if needed.

---

## Quick reference

| Thing | Where |
|---|---|
| Source code | `~/Desktop/gym/` |
| Admin schemas (advanced) | `~/Desktop/gym/studio/schemas/` |
| GitHub repo | `https://github.com/<your-username>/aaryans-fitness` |
| Live site | `https://aaryans-fitness.vercel.app` |
| Admin panel | `https://aaryans-fitness.sanity.studio` |
| Vercel dashboard | <https://vercel.com/dashboard> |
| Sanity project dashboard | <https://www.sanity.io/manage> |
| Edit content flow | studio → edit → Publish → live in 30s |
| Edit code flow | edit → `git push` → live in 1 min |
