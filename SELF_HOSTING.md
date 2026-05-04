# Self-Hosting Guide — Aaryan's Fitness Club

This guide covers hosting the site on your own VPS using Docker + nginx + Caddy.
For Netlify deployment see → `netlify.toml`.

---

## Stack

| Layer | Tool | Why |
|---|---|---|
| App build | Node 20 + CRA | Compiles React to static HTML/JS/CSS |
| Static server | nginx (inside Docker) | Serves files, SPA routing, gzip, caching |
| HTTPS + reverse proxy | Caddy | Auto Let's Encrypt cert, HTTP/3, zero config |
| CI/CD | GitHub Actions | Auto-deploys on every `git push main` |

---

## Files created

| File | Purpose |
|---|---|
| `Dockerfile` | 2-stage build: Node compiles → nginx serves |
| `nginx.conf` | SPA routing, gzip, immutable cache headers, security headers |
| `Caddyfile` | Auto-HTTPS reverse proxy (replace `yourdomain.com`) |
| `docker-compose.yml` | Wires nginx + Caddy, manages volumes |
| `deploy.sh` | One-command pull-and-rebuild on the server |
| `.github/workflows/deploy.yml` | GitHub → SSH → deploy on push to main |
| `.env.production.example` | Template — copy to `.env.production` on server |

---

## Important: env vars are baked at build time

CRA `REACT_APP_*` variables are embedded into the JS bundle during `npm run build`.
**Changing a value in `.env.production` requires re-running `bash deploy.sh` to rebuild.**

---

## One-time server setup

### 1. Get a VPS
- [Hetzner CX22](https://hetzner.com) — €4/mo (recommended, fastest EU)
- [DigitalOcean Basic](https://digitalocean.com) — $6/mo
- Ubuntu 24.04 LTS

### 2. Install Docker
```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER   # so you don't need sudo
```

### 3. Clone repo + fill env vars
```bash
git clone https://github.com/Aaryan1101-arch/-aaryans-fitness.git ~/gym
cd ~/gym
cp .env.production.example .env.production
nano .env.production       # paste your real values
```

### 4. Point your domain DNS → server IP
Add an A record: `yourdomain.com → <server IP>`
(propagation takes 1–15 min)

### 5. Update Caddyfile with your domain
```bash
nano Caddyfile             # replace yourdomain.com
```

### 6. Update OG tags
In `public/index.html` replace both `yourdomain.com` with your real domain,
then commit + push.

### 7. First deploy
```bash
bash deploy.sh
```
Caddy fetches the SSL cert automatically. Site is live at `https://yourdomain.com`.

---

## Auto-deploy on `git push`

Add 4 secrets in **GitHub → Settings → Secrets → Actions**:

| Secret | Value |
|---|---|
| `SERVER_HOST` | Server IP address |
| `SERVER_USER` | SSH username (e.g. `root` or `ubuntu`) |
| `SERVER_SSH_KEY` | Private key (run `ssh-keygen` locally, add pubkey to server `~/.ssh/authorized_keys`) |
| `SERVER_PATH` | Path on server, e.g. `/root/gym` |

Push to `main` → GitHub Actions SSHes in → `bash deploy.sh` → live in ~90 sec.

---

## After go-live: update Supabase redirect URLs

**Supabase Dashboard → Authentication → URL Configuration**

| Field | Value |
|---|---|
| Site URL | `https://yourdomain.com` |
| Redirect URLs | `https://yourdomain.com/admin` |

This ensures magic-link emails send users to the right URL.

---

## Clean up

Once running on your own server, you can delete the Vercel project from
vercel.com to avoid any accidental re-deployments from the GitHub integration.
