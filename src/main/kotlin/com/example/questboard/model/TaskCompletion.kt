package com.example.questboard.model

import java.util.UUID

data class TaskCompletion (
    val id: UUID,
    val taskId: UUID,
    val completedByUserId: UUID,
    val pointsAwarded: Int
)