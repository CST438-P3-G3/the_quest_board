package com.example.questboard.model

import java.util.UUID

data class HouseholdMember (
    val id: UUID,
    val householdId: UUID,
    val userId: UUID
)