package com.example

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.web.SecurityFilterChain


@Configuration
class SecurityConfig {
    // Registering the rules Spring Security applies to incoming HTTP requests
    @Bean
    fun securityFilterChain(http: org.springframework.security.config.annotation.web.builders.HttpSecurity): SecurityFilterChain {
        http {
            authorizeHttpRequests {
                // Allows anyone to check whether the API is running
                authorize("/health", permitAll)
                // Allows user to start GitHub sign in before they have the app token
                authorize("/auth/github", permitAll)
                // Requires authentication for all other routes
                authorize(anyRequest, authenticated)
            }
            // gives Spring Security temp browser login page
            formLogin { }
            // allows clients to authenticate with HTTP basic during development
            httpBasic { }
        }

        return http.build()
    }
}