#!/usr/bin/env bash
set -o errexit

echo "🚀 Starting NAVIDENT Backend Build..."

# Make mvnw executable
chmod +x ./mvnw

# Clean and build
echo "📦 Building application..."
./mvnw clean package -DskipTests

echo "✅ Build completed successfully!"
ls -la target/*.jar
