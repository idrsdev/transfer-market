#!/bin/bash

echo "🏗️  Building Docker images..."

# Build images with proper tags
docker compose build

# Save images to tar files
echo "💾 Saving images to tar files..."
docker save tf-frontend:latest > frontend.tar
docker save tf-backend:latest > backend.tar

echo "✅ Build complete!"