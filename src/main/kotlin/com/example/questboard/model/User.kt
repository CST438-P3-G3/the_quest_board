package com.example.questboard.model

import java.util.UUID

data class User (
    val id: UUID,
    val email: String,
    val emailVerified: Boolean,
    val displayName: String,
    val systemRole: String
)