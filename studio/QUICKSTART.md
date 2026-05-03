# Studio Quickstart

This folder is the admin panel. Follow these once, then never touch it again unless you want to add/edit content.

## First-time setup

```bash
cd studio
npm install
npx sanity init --env
# Answer the prompts:
#   Login: pick "Email / password" or "Google"
#   Project: "Create new project"
#   Project name: aaryans-fitness
#   Dataset: production (default)
#   Output path: just press Enter (current folder)
# This writes a .env file with SANITY_STUDIO_PROJECT_ID
```

Copy the project ID it printed — you'll paste it into the React app's
`.env.local` and into Vercel later.

## Run the studio locally (optional)

```bash
npm run dev
# opens http://localhost:3333
```

You can populate content here while testing. Anything you save is instantly
live on the deployed site (after a CDN refresh of ~30 seconds).

## Deploy the studio so anyone can log in from anywhere

```bash
npx sanity deploy
# Pick a hostname like: aaryans-fitness
# Studio is now live at: https://aaryans-fitness.sanity.studio
```

## Day-to-day

- Bookmark `https://aaryans-fitness.sanity.studio`.
- Log in with the email you used during `sanity init` — it sends a magic
  link, no password needed.
- Edit anything → Publish → site updates within ~30 seconds.

## What to fill in first (recommended order)

1. **Site Settings** — name, tagline, logo, contact info, social links.
2. **Hero / Landing** — upload background photo, set headline + tagline.
3. **Membership Plans** — create 3 plans (Monthly, Quarterly, Yearly).
   Mark one as "Popular".
4. **Gallery Photos** — bulk-upload images, tag with category.
5. **Team Members**, **Services**, **Reviews** — as needed.

The site always shows _something_ — until you add a real document, it
falls back to the original photos and copy from the bundled assets.
