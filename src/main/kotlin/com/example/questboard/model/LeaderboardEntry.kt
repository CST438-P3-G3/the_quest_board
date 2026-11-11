package com.example.questboard.model

import java.util.UUID

//A list of leaderboard entries is sorted and returned by LeaderboardController.
data class LeaderboardEntry (
    val userId: UUID,
    val username: String,
    val totalScore: Int
)