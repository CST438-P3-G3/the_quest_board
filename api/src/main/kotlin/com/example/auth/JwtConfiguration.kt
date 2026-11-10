package com.example.auth

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder
import java.util.Base64
import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec

// Provides the components that sign and validate the API's JWTs
@Configuration
class JwtConfiguration(
    // Reads the Base64 secret from the API container's environment
    @Value("\${JWT_SECRET_BASE64}")
    private val jwtSecretBase64: String
) {

    // Decodes the same secret for both signing and validation
    private val jwtSecretKey: SecretKey by lazy {
        val keyBytes = Base64.getDecoder().decode(jwtSecretBase64)

        require(keyBytes.size >= 32) {
            "JWT_SECRET_BASE64 must decode to at least 32 bytes."
        }

        SecretKeySpec(keyBytes, "HmacSHA256")
    }

    // Signs JWTs using the HS256 algorithm
    @Bean
    fun jwtEncoder(): JwtEncoder =
        NimbusJwtEncoder.withSecretKey(jwtSecretKey)
            .algorithm(MacAlgorithm.HS256)
            .build()

    // Checks the signature and standard time claims on incoming JWTs
    @Bean
    fun jwtDecoder(): JwtDecoder =
        NimbusJwtDecoder.withSecretKey(jwtSecretKey)
            .macAlgorithm(MacAlgorithm.HS256)
            .build()
}