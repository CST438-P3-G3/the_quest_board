package com.example.model

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import java.util.UUID

data class HouseholdMember (
    @Id
    val id: UUID,
    @Column("household_id")
    val householdId: UUID,
    @Column("user_id")
    val userId: UUID
)