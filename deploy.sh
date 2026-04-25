#!/bin/bash
set -e

echo "Pulling latest code..."
git fetch origin

# Check if package.json changed in the incoming commits
DEPS_CHANGED=$(git diff HEAD origin/main -- package.json package-lock.json | wc -l)

# Always sync server to match GitHub exactly (discards any local server changes)
git reset --hard origin/main

if [ "$DEPS_CHANGED" -gt 0 ]; then
  echo "Dependencies changed — doing full Docker rebuild..."
  sudo docker-compose up -d --build
else
  echo "No dependency changes — fast deploy..."
  npm install
  NODE_OPTIONS="--max-old-space-size=3072" npm run build
  sudo docker-compose up -d --no-build --force-recreate
fi

echo "Restarting Caddy (HTTPS)..."
sudo systemctl restart caddy

echo "Done! Site is live."
