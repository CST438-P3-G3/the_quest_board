package com.example.model

import java.util.UUID

data class HouseholdMember (
    val id: UUID,
    val householdId: UUID,
    val userId: UUID
)