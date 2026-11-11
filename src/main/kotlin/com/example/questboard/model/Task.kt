package com.example.questboard.model

import java.util.UUID

data class Task (
    val id: UUID,
    val household_id: UUID,
    val created_by_user_id: UUID,
    val assignee_user_id: UUID,
    val name: String,
    val description: String,
    val point_value: Int,
    val location: String
)