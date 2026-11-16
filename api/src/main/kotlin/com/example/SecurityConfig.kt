package com.example

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource


@Configuration
class SecurityConfig {

    // Registering the rules Spring Security applies to incoming HTTP requests
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            // Allow the Expo web app to call the API from localhost:8081
            cors {
                configurationSource = corsConfigurationSource()
            }
            // This API uses bearer tokens rather than browser session cookies
            csrf {
                disable()
            }
            // Do not create or use an HTTP session for authentication
            sessionManagement {
                sessionCreationPolicy = SessionCreationPolicy.STATELESS
            }

            authorizeHttpRequests {
                // Allows anyone to check whether the API is running
                authorize("/health", permitAll)
                // Allows user to start GitHub sign in before they have the app token
                authorize("/auth/github", permitAll)

                // Requires authentication for all other routes
                authorize(anyRequest, authenticated)
            }
            // Validates bearer JWTs using the JwtDecoder bean
            oauth2ResourceServer {
                jwt { }
            }
            // gives Spring Security temp browser login page
//            formLogin { }
            // allows clients to authenticate with HTTP basic during development
//            httpBasic { }
        }

        return http.build()
    }
    // Defines which browser origins can call the API
    @Bean
    fun corsConfigurationSource(): UrlBasedCorsConfigurationSource {
        // Render supplies the production web origin through this environment variable.
        // Keep localhost as the default for local Expo web development.
        val allowedOriginList = (System.getenv("APP_ALLOWED_ORIGINS")
            ?: "http://localhost:8081")
            .split(",")
            .map(String::trim)
            .filter(String::isNotEmpty)

        val configuration = CorsConfiguration().apply {
            // Allows the local and hosted Expo web app origins
            allowedOrigins = allowedOriginList

            // Allows the methods used by the app
            allowedMethods = listOf(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
            )

            // Allows JSON and bearer token headers
            allowedHeaders = listOf("*")

            // The app uses JWT headers instead of browser cookies
            allowCredentials = false
        }

        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**", configuration)
        }
    }

}
