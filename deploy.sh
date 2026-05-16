#!/bin/bash
set -e

echo "Building image on Mac..."
docker build --platform linux/amd64 -t paritkansal/portfolio-site:latest .

echo "Pushing to Docker Hub..."
docker push paritkansal/portfolio-site:latest

echo "Deploying on server..."
ssh portfolio "
  cd /home/paritkansal121/portfolio-site &&
  sudo chown -R parit:parit /home/paritkansal121/portfolio-site &&
  git fetch origin && git reset --hard origin/main &&
  sudo docker-compose pull &&
  sudo docker-compose up -d
"

echo "Done! Site is live."
