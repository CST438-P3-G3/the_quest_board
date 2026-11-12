package com.example

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

// Registers this class as a handler for HTTP requests
@RestController
class HealthController {

    // Handles GET requests to /health
    @GetMapping("/health")
    fun health(): Map<String, String> {
        // Spring returns this map as a JSON response
        return mapOf("status" to "ok")
    }
}