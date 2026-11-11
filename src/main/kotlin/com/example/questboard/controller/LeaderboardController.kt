package com.example.questboard.controller

import com.example.questboard.model.Leaderboard
import com.example.questboard.service.LeaderboardService
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.security.access.prepost.PreAuthorize
import java.util.UUID

@RestController
@RequestMapping("/leaderboard")
class LeaderboardController(
    private val leaderboardService: LeaderboardService
) {

    //Preauthorize will throw a 401 error if the user is not authenticated
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{household_id}")
    fun getLeaderboard(
        @PathVariable householdId: UUID
    ): Leaderboard {
        //It doesn't make sense for it to be null because of the preauth, but the IDE insisted
        //I either make the field nullable or use requireNotNull.
        val authentication = requireNotNull(
            SecurityContextHolder.getContext().authentication
        ) {
            "No authenticated user found"
        }
        val signedInUserId = UUID.fromString(authentication.name)
        return leaderboardService.getLeaderboard(
            householdId,
            signedInUserId
        )
    }
}