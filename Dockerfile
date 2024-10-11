FROM openjdk:17-jdk-slim

# 작업 디렉터리 설정
WORKDIR /app

# 모든 파일을 컨테이너에 복사
COPY . .

# Gradle Wrapper가 있는지 확인하고, Gradle을 설치
RUN apt-get update && apt-get install -y curl unzip \
    && curl -s "https://get.sdkman.io" | bash \
    && source "$HOME/.sdkman/bin/sdkman-init.sh" \
    && sdk install gradle 8.10.2

# Gradle을 사용하여 JAR 파일 빌드
RUN ./gradlew build

# 빌드된 JAR 파일을 실행
ENTRYPOINT ["java", "-jar", "build/libs/BOOKPLAYLIST-0.0.1-SNAPSHOT.jar"]
