#Build stage
FROM eclipse-temurin:25-jdk-alpine AS build

WORKDIR /app

#Copy gradle configuration files
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle.kts settings.gradle.kts ./

#Copy source code
COPY src ./src

# Build executable Spring Boot JAR
RUN sed -i 's/\r$//' gradlew \
    && chmod +x gradlew \
    && ./gradlew bootJar --no-daemon \
    && find build/libs/ -name "*.jar" \
       ! -name "*-plain.jar" \
       -exec cp {} /app/app.jar \;

#Runtime stage
FROM eclipse-temurin:25-jre-jammy
WORKDIR /app

COPY --from=build /app/app.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]