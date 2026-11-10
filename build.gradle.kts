import org.gradle.api.tasks.compile.JavaCompile
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("org.springframework.boot") version "4.1.1"
    id("io.spring.dependency-management") version "1.1.7"
    kotlin("jvm") version "2.2.21"
    kotlin("plugin.spring") version "2.2.21"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    // This provides JPA entities and respositories for storing app users and OAuth identities
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    // This adds support for validating JWT bearer tokens on protected API routes
    implementation("org.springframework.boot:spring-boot-starter-security-oauth2-resource-server")

    testImplementation("org.springframework.boot:spring-boot-starter-test")

    // Provides the PostgreSQL driver when the API connects to the database at runtime
    runtimeOnly("org.postgresql:postgresql")
}

kotlin {
    jvmToolchain(25)

    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)

        freeCompilerArgs.addAll(
            "-Xjsr305=strict",
            "-Xannotation-default-target=param-property"
        )
    }
}

tasks.withType<JavaCompile> {
    options.release.set(17)
}

tasks.withType<Test> {
    useJUnitPlatform()
}
