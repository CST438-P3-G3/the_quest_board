package com.example.model

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.util.UUID

@Table("task")
data class Task (
    @Id
    val id: UUID,
    @Column("household_id")
    val householdId: UUID,
    @Column("created_by_user_id")
    val createdByUserId: UUID,
    @Column("assignee_user_id")
    val assigneeUserId: UUID,
    @Column("name")
    val name: String,
    @Column("description")
    val description: String,
    @Column("point_value")
    val pointValue: Int,
    @Column("location")
    val location: String
)