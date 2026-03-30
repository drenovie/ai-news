#!/bin/bash

# Activy News — Cloudflare Pages Deployment Script
# Usage: ./deploy.sh [project-name]

PROJECT_NAME=${1:-activy-news}

echo "🚀 Starting deployment for $PROJECT_NAME..."

# 1. Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# 2. Build the project
echo "🏗️ Building production artifacts..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Aborting deployment."
  exit 1
fi

# 3. Deploy to Cloudflare Pages
echo "☁️ Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name "$PROJECT_NAME"

if [ $? -eq 0 ]; then
  echo "✅ Deployment successful!"
else
  echo "❌ Deployment failed."
  exit 1
fi
