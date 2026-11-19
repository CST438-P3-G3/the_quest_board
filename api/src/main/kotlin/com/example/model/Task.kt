package com.example.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "task")
data class Task(
    @Id
    val id: UUID,

    @Column(name = "household_id")
    val householdId: UUID,

    @Column(name = "created_by_user_id")
    val createdByUserId: UUID,

    @Column(name = "assignee_user_id")
    val assigneeUserId: UUID,

    @Column(name = "name")
    val name: String,

    @Column(name = "description")
    val description: String,

    @Column(name = "point_value")
    val pointValue: Int,

    @Column(name = "location")
    val location: String
)