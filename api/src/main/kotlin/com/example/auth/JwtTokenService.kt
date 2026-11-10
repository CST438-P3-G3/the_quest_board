package com.example.auth

import com.example.auth.entity.AppUser
import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.security.oauth2.jwt.JwsHeader
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.Instant

// Contains the token string and its lifetime for the API response
data class IssuedJwt(
    val accessToken: String,
    val expiresIn: Int
)

@Service
class JwtTokenService(
    private val jwtEncoder: JwtEncoder
) {

    // Creates the API's short lived access token for a saved user
    fun issueFor(user: AppUser): IssuedJwt {
        val issuedAt = Instant.now()
        val expiresAt = issuedAt.plus(TOKEN_LIFETIME)

        // A saved app user must have an ID to use as the token subject.
        val userId = requireNotNull(user.id) {
            "Cannot issue a JWT for a user that has not been saved."
        }

        // Standard claims describe who issued the token, who it represents, and when it becomes invalid.
        val claims = JwtClaimsSet.builder()
            .issuer(TOKEN_ISSUER)
            .subject(userId.toString())
            .issuedAt(issuedAt)
            .expiresAt(expiresAt)
            .build()

        // Selects the same signing algorithm configured in JwtConfiguration
        val header = JwsHeader.with(MacAlgorithm.HS256).build()

        val encodedJwt = jwtEncoder.encode(
            JwtEncoderParameters.from(header, claims)
        )

        return IssuedJwt(
            accessToken = encodedJwt.tokenValue,
            expiresIn = TOKEN_LIFETIME.seconds.toInt()
        )
    }

    private companion object {
        const val TOKEN_ISSUER = "quest-board-api"
        val TOKEN_LIFETIME: Duration = Duration.ofMinutes(15)
    }
}