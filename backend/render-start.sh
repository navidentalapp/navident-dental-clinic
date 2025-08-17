#!/bin/bash
echo "=== Starting NAVIDENT Backend ==="
echo "Environment variables:"
echo "MONGODB_URI: ${MONGODB_URI:0:30}..."
echo "SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE}"

# Start with explicit profile and MongoDB URI
java -jar \
  -Dspring.profiles.active=prod \
  -Dspring.data.mongodb.uri="$MONGODB_URI" \
  -Dspring.data.mongodb.database=navident_clinic \
  target/navident-backend-1.0.0.jar
