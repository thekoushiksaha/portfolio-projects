# ------------ build stage --------------
FROM eclipse-temurin:25-jdk AS build
WORKDIR /workspace

COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline

COPY src src
RUN ./mvnw -B package -DskipTests

# ------------ run stage --------------
FROM eclipse-temurin:25-jre
WORKDIR /app

RUN useradd --system --create-home appuser
COPY --from=build /workspace/target/*.jar app.jar
USER appuser

EXPOSE 8080
ENTRYPOINT [ "java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar" ]