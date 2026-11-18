package com.example.model

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.util.UUID

@Table("task_completion")
data class TaskCompletion (
    @Id
    val id: UUID,
    @Column("task_id")
    val taskId: UUID,
    @Column("completed_by_user_id")
    val completedByUserId: UUID,
    @Column("points_awarded")
    val pointsAwarded: Int
)