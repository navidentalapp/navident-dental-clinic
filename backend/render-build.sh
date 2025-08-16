#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting Maven build..."
./mvnw clean install -DskipTests

echo "Build completed successfully!"
# Check if the build was successful