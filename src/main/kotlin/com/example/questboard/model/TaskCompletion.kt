package com.example.questboard.model

import java.util.UUID

data class TaskCompletion (
    val id: UUID,
    val task_id: UUID,
    val completed_by_user_id: UUID,
    val points_awarded: Int
)