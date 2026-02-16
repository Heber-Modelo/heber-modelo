plugins {
    java
    alias(libs.plugins.spotless)
    alias(libs.plugins.springboot)
    alias(libs.plugins.springdependency)
}

group = "io.github.heberbarra"
version = "0.0.25-SNAPSHOT"

repositories {
    mavenCentral()
    mavenLocal()
}

java {
    sourceCompatibility = JavaVersion.VERSION_24
    targetCompatibility = JavaVersion.VERSION_24
}

dependencies {
    implementation(libs.apachePDFBox) {
        exclude("commons-logging", "commons-logging")
    }
    implementation(libs.cdimascioDotenv)
    implementation(libs.jakartaXML)
    implementation(libs.jlineJansi)
    implementation(libs.hibernateCore)
    implementation(libs.heberModeloAPI)
    implementation(libs.mysqlConnector)
    implementation(libs.tomlj)
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-hateoas")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    implementation("org.springframework.boot:spring-boot-starter-web")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

spotless {

    java {
        importOrder()
        removeUnusedImports()
        cleanthat()
        palantirJavaFormat()
        formatAnnotations()
    }

}

tasks.test {
    useJUnitPlatform()
}

tasks.getByName<org.springframework.boot.gradle.tasks.bundling.BootJar>("bootJar") {
    exclude("static/scss/")
    exclude("static/typescript")
    this.archiveFileName.set("${archiveBaseName.get()}.${archiveExtension.get()}")
}
