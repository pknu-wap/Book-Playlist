# Java 17 JDK 사용 (Debian 기반)
FROM openjdk:17-jdk

# 작업 디렉터리 설정
WORKDIR /app

# 프로젝트의 모든 파일을 컨테이너로 복사
COPY . .

# Gradle Wrapper가 있는지 확인하고, Gradle을 설치
RUN apk update && apk add curl unzip \
    && curl -s "https://get.sdkman.io" | bash \
    && source "$HOME/.sdkman/bin/sdkman-init.sh" \
    && sdk install gradle 8.10.2
# Gradle을 사용하여 JAR 파일 빌드
RUN ./gradlew build

# 빌드 후 생성된 JAR 파일을 실행
CMD ["java", "-jar", "build/libs/BOOKPLAYLIST-0.0.1-SNAPSHOT.jar"]
