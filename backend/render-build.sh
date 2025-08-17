#!/bin/bash
echo "=== Starting Maven build for production ==="
echo "Environment check:"
echo "MONGODB_URI: ${MONGODB_URI}"
echo "SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE}"

if [ -z "$MONGODB_URI" ]; then
    echo "ERROR: MONGODB_URI environment variable is not set!"
    exit 1
fi

# Clean and build with production profile
./mvnw clean install -Pprod -DskipTests

echo "Build completed successfully!"
