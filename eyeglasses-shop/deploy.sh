#!/bin/bash

# Deployment script for eyeglasses-shop
# This script can be run manually or called from CI/CD

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/eyeglasses-shop

# Pull latest changes (if using Git)
if [ -d .git ]; then
    echo "📥 Pulling latest changes..."
    git fetch origin
    git reset --hard origin/main
else
    echo "⚠️  Not a git repository, skipping git pull"
fi

# Stop and remove old containers
echo "🛑 Stopping old containers..."
docker compose down || true

# Remove old images (optional - uncomment to save disk space)
# echo "🧹 Cleaning up old images..."
# docker image prune -f

# Rebuild image
echo "🏗️ Building new image..."
docker compose build --no-cache

# Start new containers
echo "🚢 Starting new containers..."
docker compose up -d

# Wait for containers to be healthy
echo "⏳ Waiting for containers to be healthy..."
sleep 10

# Show status
echo "📋 Container status:"
docker compose ps

# Show recent logs
echo "📋 Recent logs:"
docker compose logs --tail=50

# Health check
echo "🔍 Performing health check..."
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Deployment successful! Application is running."
    exit 0
else
    echo "⚠️  Health check failed. Check logs with: docker compose logs"
    exit 1
fi

