# ---- Frontend build ----
FROM node:22-alpine AS frontend
WORKDIR /app
COPY lifedrop-frontend/package*.json ./
RUN npm ci
COPY lifedrop-frontend/ ./
RUN npm run build

# ---- Backend build, with the frontend bundle embedded ----
FROM maven:3.9-eclipse-temurin-17 AS backend
WORKDIR /app
COPY BloodDonationManagement/pom.xml ./
COPY BloodDonationManagement/src ./src
COPY --from=frontend /app/dist ./src/main/resources/static
RUN mvn -q -DskipTests package

# ---- Runtime ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend /app/target/BloodDonationManagement-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
