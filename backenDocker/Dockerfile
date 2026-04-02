FROM eclipse-temurin:21-jdk-alpine
LABEL authors="uttsv"

VOLUME /tmp
ARG JAR_FILE
COPY ${JAR_FILE} NailsApp-1.0-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/NailsApp-1.0-SNAPSHOT.jar"]