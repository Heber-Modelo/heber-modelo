FROM amazoncorretto:25-alpine3.22 AS builder
ARG JAR_FILE=build/libs/heber-modelo.jar
COPY ${JAR_FILE} heber-modelo.jar

RUN java -Djarmode=tools  -jar heber-modelo.jar extract --layers --launcher

FROM amazoncorretto:25-alpine3.22
COPY --from=builder /heber-modelo/dependencies/ ./
COPY --from=builder /heber-modelo/snapshot-dependencies/ ./
COPY --from=builder /heber-modelo/spring-boot-loader/ ./
COPY --from=builder /heber-modelo/application/ ./

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
