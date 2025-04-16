FROM eclipse-temurin:23-jdk AS builder

WORKDIR /app

COPY . .

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:23-jdk

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=docker

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "app.jar"]
