#!/bin/bash
echo "Starting Maven build..."
./mvnw clean install -DskipTests
echo "Build completed successfully!"
