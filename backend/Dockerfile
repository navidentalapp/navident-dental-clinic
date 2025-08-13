# ================================
#  Stage 1: Build with Maven
# ================================
FROM eclipse-temurin:17-jdk-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy Maven wrapper and pom.xml first (for dependency caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (to leverage Docker build cache)
RUN ./mvnw dependency:go-offline -B

# Copy the entire source code
COPY src src

# Build the Spring Boot application JAR
RUN ./mvnw clean package -DskipTests

# ================================
#  Stage 2: Run Spring Boot JAR
# ================================
FROM eclipse-temurin:17-jre-alpine

# Environment variables for Java options (adjust heap sizes for Render free tier)
ENV JAVA_OPTS="-Xms512m -Xmx1024m"

# Set working directory
WORKDIR /app

# Copy only the built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Health check for container (optional but good for production)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the Spring Boot application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
