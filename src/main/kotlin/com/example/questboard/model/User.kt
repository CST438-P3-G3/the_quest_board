package com.example.questboard.model

import java.util.UUID

data class User (
    val id: UUID,
    val email: String,
    val email_verified: Boolean,
    val display_name: String,
    val system_role: String
)