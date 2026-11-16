package com.example

// Importing Spring Boot applicaiton startup functions
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

// Making this the main spring boot applicaiton
// We are going to use this to configure our app and find components
@SpringBootApplication
class QuestBoardApplication

// The JVM will call main when the applicaiton starts
// The arguments are going to be any command line arguments passed to our app
fun main(args: Array<String>) {
    runApplication<QuestBoardApplication>(*args)
}