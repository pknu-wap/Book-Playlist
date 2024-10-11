FROM openjdk:17-jdk  # JRE 대신 JDK로 변경
WORKDIR /app
COPY build/libs/BOOKPLAYLIST-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
