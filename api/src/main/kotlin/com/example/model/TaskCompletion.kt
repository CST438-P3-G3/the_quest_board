package com.example.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "task_completion")
data class TaskCompletion(
    @Id
    val id: UUID,

    @Column(name = "task_id")
    val taskId: UUID,

    @Column(name = "completed_by_user_id")
    val completedByUserId: UUID,

    @Column(name = "points_awarded")
    val pointsAwarded: Int
)