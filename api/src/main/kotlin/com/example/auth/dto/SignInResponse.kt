package com.example.auth.dto

import java.util.UUID

// Represents the successful response from POST /auth/github
data class SignInResponse(
    // The short lived token issued by The Quest Board API
    val accessToken: String,

    // Identifies the kind of token the client received
    val tokenType: String = "Bearer",

    // How many seconds the access token remains valid
    val expiresIn: Int,

    // The signed in user's app account details
    val user: UserSummary
)

// Public account details returned to the signed in client

data class UserSummary(
    // The app's internal user ID, represented as a UUID
    val id: UUID,

    // The name displayed in The Quest Board
    val displayName: String,

    // The user's verified email, if included in the response
    val email: String? = null
)