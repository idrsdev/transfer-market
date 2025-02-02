#!/bin/bash

# Default values
DEFAULT_IP=""
DEFAULT_USER="root"
DEFAULT_PATH="/opt/tf"

# Get arguments or use defaults
DROPLET_IP=${1:-$DEFAULT_IP}
DROPLET_USER=${2:-$DEFAULT_USER}
DEPLOY_PATH=${3:-$DEFAULT_PATH}

echo "🚀 Deploying to Digital Ocean droplet..."
echo "IP: $DROPLET_IP"
echo "User: $DROPLET_USER"
echo "Path: $DEPLOY_PATH"

# Create deployment directory if it doesn't exist
ssh digitalocean "mkdir -p $DEPLOY_PATH/backend"  # Create backend directory

echo "📁 Copying configuration files..."
# Copy docker-compose and env files
scp docker-compose.yml digitalocean:$DEPLOY_PATH/
scp backend/.env digitalocean:$DEPLOY_PATH/backend/.env

echo "📦 Copying Docker images..."
# Copy the images to the server
scp frontend.tar backend.tar digitalocean:$DEPLOY_PATH/

echo "🔄 Restarting containers..."
# SSH into the server and load the images
ssh digitalocean "cd $DEPLOY_PATH && \
    docker load < frontend.tar && \
    docker load < backend.tar && \
    docker-compose down && \
    docker-compose up -d && \
    rm frontend.tar backend.tar"

# Clean up local tar files
echo "🧹 Cleaning up local files..."
rm frontend.tar backend.tar

echo "✅ Deployment complete!"
