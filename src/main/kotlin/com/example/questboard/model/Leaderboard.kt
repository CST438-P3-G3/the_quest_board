package com.example.questboard.model

import java.util.UUID

data class Leaderboard(
    val householdId: UUID,
    val leaderboard: List<LeaderboardEntry>
)
