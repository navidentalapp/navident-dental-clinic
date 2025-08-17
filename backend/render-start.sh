#!/bin/bash
echo "Starting NAVIDENT Backend..."
java -Dspring.profiles.active=prod -jar target/navident-backend-1.0.0.jar
echo "Backend started successfully!"