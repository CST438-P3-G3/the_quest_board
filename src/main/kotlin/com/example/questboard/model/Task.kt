package com.example.questboard.model

import java.util.UUID

data class Task (
    val id: UUID,
    val householdId: UUID,
    val createdByUserId: UUID,
    val assigneeUserId: UUID,
    val name: String,
    val description: String,
    val pointValue: Int,
    val location: String
)