#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting NAVIDENT Backend..."
java -jar -Dspring.profiles.active=prod target/*.jar
# Check if the build was successful