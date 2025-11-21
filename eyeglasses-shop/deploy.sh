#!/bin/bash

# Deployment script for eyeglasses-shop
# This script can be run manually or called from CI/CD

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Navigate to project directory
# This script should be run from the eyeglasses-shop directory
# The workflow handles git pull at the repo root level

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    # Try to find the project directory
    if [ -d "/var/www/eyeglasses-shop/eyeglasses-shop" ] && [ -f "/var/www/eyeglasses-shop/eyeglasses-shop/docker-compose.yml" ]; then
        cd /var/www/eyeglasses-shop/eyeglasses-shop
        echo "📂 Navigated to project directory: $(pwd)"
    elif [ -d "eyeglasses-shop" ] && [ -f "eyeglasses-shop/docker-compose.yml" ]; then
        cd eyeglasses-shop
        echo "📂 Navigated to project directory: $(pwd)"
    else
        echo "❌ Error: Cannot find docker-compose.yml!"
        echo "Current directory: $(pwd)"
        echo "Files in current directory:"
        ls -la
        exit 1
    fi
else
    echo "📂 Working in project directory: $(pwd)"
fi

# Verify we're in the right place
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found in $(pwd)"
    exit 1
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

