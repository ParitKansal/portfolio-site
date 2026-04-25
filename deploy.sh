#!/bin/bash
# Fast deploy: builds on host, mounts dist into container, no image rebuild
set -e

echo "Pulling latest code..."
git pull

echo "Installing any new dependencies..."
npm install

echo "Building app..."
NODE_OPTIONS="--max-old-space-size=3072" npm run build

echo "Restarting container..."
sudo docker-compose up -d --no-build --force-recreate

echo "Done! Site is live."
