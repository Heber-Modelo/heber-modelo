plugins {
    java
    alias(libs.plugins.spotless)
    alias(libs.plugins.springboot)
    alias(libs.plugins.springdependency)
}

group = "io.github.heberbarra"
version = "0.0.36-SNAPSHOT"


repositories {
    mavenCentral()
    mavenLocal()
}

java {
    sourceCompatibility = JavaVersion.VERSION_25
    targetCompatibility = JavaVersion.VERSION_25
}

dependencies {
    implementation(libs.cdimascioDotenv)
    implementation(libs.hibernateCore)
    implementation(libs.heberModeloAPI)
    implementation(libs.jakartaXML)
    implementation(libs.jlineJansi)
    implementation(libs.jsoup)
    implementation(libs.mysqlConnector)
    implementation(libs.openHTMLtoPDFCore)
    implementation(libs.openHTMLtoPDFPdfBox)
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

    layered {
        application {
            intoLayer("spring-boot-loader") {
                include("org/springframework/boot/loader/**")
            }
            intoLayer("application")
        }
        dependencies {
            intoLayer("snapshot-dependencies") {
                include("*:*:*SNAPSHOT")
            }
            intoLayer("dependencies")
        }
        layerOrder = listOf("dependencies", "spring-boot-loader", "snapshot-dependencies", "application")
    }

    this.archiveFileName.set("${archiveBaseName.get()}.${archiveExtension.get()}")
}
