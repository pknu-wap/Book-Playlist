# 빌드 단계
FROM openjdk:17-jdk-slim AS build

# 작업 디렉터리 설정
WORKDIR /app

# 모든 파일을 컨테이너에 복사
COPY . .

# gradlew에 실행 권한 부여
RUN chmod +x gradlew

# 애플리케이션 빌드
RUN ./gradlew clean build

# 실행 단계
FROM openjdk:17-jdk-slim

# 작업 디렉터리 설정
WORKDIR /app

# 빌드된 JAR 파일을 복사
COPY --from=build /app/build/libs/BOOKPLAYLIST-0.0.1-SNAPSHOT.jar .

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "BOOKPLAYLIST-0.0.1-SNAPSHOT.jar"]
