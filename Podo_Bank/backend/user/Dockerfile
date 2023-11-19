# 베이스 이미지로 OpenJDK 11을 사용
FROM openjdk:17-jdk

ENV TZ=Asia/Seoul

# 작업 디렉토리 설정
WORKDIR /app

# JAR 파일을 컨테이너 안의 /app 디렉토리로 복사
COPY build/libs/PODO-BANK-USER-0.0.1-SNAPSHOT.jar /app/PODO-BANK-USER-0.0.1-SNAPSHOT.jar

# 애플리케이션 실행 명령어 설정
CMD ["java", "-jar", "/app/PODO-BANK-USER-0.0.1-SNAPSHOT.jar"]