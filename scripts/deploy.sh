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
ssh $DROPLET_USER@$DROPLET_IP "mkdir -p $DEPLOY_PATH/backend"  # Create backend directory

echo "📁 Copying configuration files..."
# Copy docker-compose and env files
scp docker-compose.yml $DROPLET_USER@$DROPLET_IP:$DEPLOY_PATH/
scp backend/.env $DROPLET_USER@$DROPLET_IP:$DEPLOY_PATH/backend/.env

echo "📦 Copying Docker images..."
# Copy the images to the server
scp frontend.tar backend.tar $DROPLET_USER@$DROPLET_IP:$DEPLOY_PATH/

echo "🔄 Restarting containers..."
# SSH into the server and load the images
ssh $DROPLET_USER@$DROPLET_IP "cd $DEPLOY_PATH && \
    docker load < frontend.tar && \
    docker load < backend.tar && \
    docker-compose down && \
    docker-compose up -d && \
    rm frontend.tar backend.tar"

# Clean up local tar files
echo "🧹 Cleaning up local files..."
rm frontend.tar backend.tar

echo "✅ Deployment complete!"