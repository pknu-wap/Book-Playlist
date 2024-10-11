# 1. Java 17 런타임 이미지를 기반으로 설정
FROM openjdk:17-jre

# 2. 컨테이너 내에서 작업할 디렉터리 설정
WORKDIR /app

# 3. 로컬에서 빌드된 JAR 파일을 컨테이너 내부로 복사
COPY build/libs/Bookplaylist-0.0.1-SNAPSHOT.jar app.jar

# 4. 컨테이너 시작 시 실행할 명령어 지정
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
