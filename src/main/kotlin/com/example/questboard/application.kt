package com.example.questboard
//Basic application file for docker setup purposes, can be refactored later according to project structure preferences
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity

@SpringBootApplication
@EnableMethodSecurity
class QuestBoardApplication

fun main(args: Array<String>) {
    runApplication<QuestBoardApplication>(*args)
}