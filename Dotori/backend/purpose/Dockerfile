FROM openjdk:17-jdk

ENV TZ=Asia/Seoul

ARG JAR_FILE=./build/libs/Dotori-Purpose-Service-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java","-jar","/app.jar"]