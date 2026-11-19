package com.example.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "household_member")
data class HouseholdMember(
    @Id
    val id: UUID,

    @Column(name = "household_id")
    val householdId: UUID,

    @Column(name = "user_id")
    val userId: UUID
)