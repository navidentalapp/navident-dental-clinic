#!/usr/bin/env bash
set -o errexit

echo "🏥 Starting NAVIDENT Dental Clinic Backend..."

# Start the application
java -jar -Dspring.profiles.active=prod target/navident-backend-1.0.0.jar
