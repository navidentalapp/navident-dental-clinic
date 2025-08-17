# Use official OpenJDK 17 runtime as base image
FROM openjdk:17-jdk-slim

# Set working directory inside container
WORKDIR /app

# Copy Maven wrapper and pom.xml first (for better caching)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Make Maven wrapper executable
RUN chmod +x ./mvnw

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Set environment variable for Spring profile
ENV SPRING_PROFILES_ACTIVE=prod

# Command to run the application
CMD ["java", "-jar", "target/navident-backend-1.0.0.jar"]
