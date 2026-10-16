#!/bin/bash
set -e

# Server: VM with external IP 136.114.140.36 in project portfolio-site-480613.
# The server step goes through `gcloud compute ssh`, which has passwordless sudo
# (plain `ssh portfolio` asks for the parit user's sudo password).
SERVER_IP="136.114.140.36"

echo "Building image on Mac..."
docker build --platform linux/amd64 -t paritkansal/portfolio-site:latest .

echo "Pushing to Docker Hub..."
docker push paritkansal/portfolio-site:latest

echo "Finding the server..."
VM_NAME=$(gcloud compute instances list --format="value(name)" --filter="networkInterfaces[0].accessConfigs[0].natIP=${SERVER_IP}")
VM_ZONE=$(gcloud compute instances list --format="value(zone.basename())" --filter="networkInterfaces[0].accessConfigs[0].natIP=${SERVER_IP}")
if [ -z "$VM_NAME" ]; then
  echo "No VM found with IP ${SERVER_IP}. Run 'gcloud auth login' and check the project." >&2
  exit 1
fi

echo "Deploying on server ($VM_NAME, $VM_ZONE)..."
gcloud compute ssh "$VM_NAME" --zone="$VM_ZONE" --command="
  cd /home/paritkansal121/portfolio-site &&
  sudo chown -R parit:parit . &&
  sudo -u parit git fetch origin && sudo -u parit git reset --hard origin/main &&
  sudo docker-compose pull &&
  sudo docker-compose up -d
"

echo "Done! Site is live."
