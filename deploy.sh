#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  deploy.sh — run this on the server to pull & rebuild.
#  Requires .env.production in the same directory.
# ─────────────────────────────────────────────────────────────
set -euo pipefail

echo "→ Pulling latest code..."
git pull origin main

echo "→ Rebuilding containers (this takes ~1 min)..."
docker compose --env-file .env.production up -d --build --remove-orphans

echo "→ Pruning unused images..."
docker image prune -f

echo "✓ Done — site is live."
