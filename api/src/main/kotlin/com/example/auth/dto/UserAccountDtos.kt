package com.example.auth.dto

import java.util.UUID

// Data returned when the signed in user views their profile
data class UserAccountResponse(
    // The internal Quest Board account ID
    val id: UUID,

    // The user's display name
    val displayName: String,

    // The verified email connected to the account
    val email: String,

    // The account type shown in the profile screen
    val accountType: String
)

// Data accepted when the signed in user updates their profile
data class UpdateUserAccountRequest(
    // Only the display name can be changed by the user
    val displayName: String
)