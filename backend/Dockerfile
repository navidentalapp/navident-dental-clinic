# Multi-stage build for Spring Boot application

# Stage 1: Build stage
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml first (for dependency caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x ./mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build application
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Set the MongoDB URI and default database via environment variable
ENV SPRING_DATA_MONGODB_URI="mongodb+srv://navidentalpg:25MhnHa4JeJIo8aZ@cluster0.rwxhhmt.mongodb.net/navident_clinic?retryWrites=true&w=majority&appName=Cluster0"

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
