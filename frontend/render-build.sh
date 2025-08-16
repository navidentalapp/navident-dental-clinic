#!/usr/bin/env bash
set -o errexit

echo "🚀 Starting NAVIDENT Frontend Build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the app
echo "🏗️ Building React application..."
npm run build

# Verify build
if [ -d "build" ]; then
    echo "✅ Build completed successfully!"
    ls -la build/
else
    echo "❌ Build directory not found!"
    exit 1
fi
