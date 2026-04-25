#!/bin/bash
set -e

echo "Pulling latest code..."
git fetch origin
git reset --hard origin/main

echo "Rebuilding and restarting..."
sudo docker-compose up -d --build

echo "Restarting Caddy (HTTPS)..."
sudo systemctl restart caddy

echo "Done! Site is live."
