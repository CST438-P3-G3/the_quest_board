package com.example.questboard.service

import com.example.questboard.model.Leaderboard
import com.example.questboard.model.LeaderboardEntry
import com.example.questboard.repository.HouseholdMemberRepository
import com.example.questboard.repository.TaskCompletionRepository
import com.example.questboard.repository.TaskRepository
import com.example.questboard.repository.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import org.springframework.security.access.AccessDeniedException
import java.util.UUID
import org.springframework.security.core.userdetails.UsernameNotFoundException

class LeaderboardService (
    private val householdMemberRepository: HouseholdMemberRepository,
    private val taskRepository: TaskRepository,
    private val taskCompletionRepository: TaskCompletionRepository,
    private val userRepository: UserRepository
) {
    fun getLeaderboard(householdId: UUID, currentUser: UUID) : Leaderboard {
        /* If the household ID is correctly formatted but not found, throw a 404 error */
        if (!householdMemberRepository.existsById(householdId)) {
            throw ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Household not found"
            )
        }

        val members = householdMemberRepository.findAllByHouseholdId(householdId).toList()
        val tasks = taskRepository.findAllByHouseholdId(householdId).toList()
        val taskIds = tasks.map {it.id}

        /* If the household ID is found but the user is not in the household and is not an admin, throw a 403 error */
        val isMember = members.any {
            it.userId == currentUser
        }
        val user = userRepository.findById(currentUser)
            .orElseThrow {
                UsernameNotFoundException("User not found")
            }

        //The implementation of checking the systemRole here is a placeholder and may
        //need to be updated once the actual security details are known.
        if (!isMember && user.systemRole != "ADMIN") {
            throw AccessDeniedException(
                "Not authorized to view this leaderboard."
            )
        }

        val completions = if(taskIds.isEmpty()){
            emptyList()
        }
        else{
            taskCompletionRepository.findAllByTaskIdIn(taskIds)
        }

        //Aggregate points and group by user
        val pointsByUser = completions.groupingBy { it.completedByUserId }.fold(0)
        { total, completion -> total + completion.pointsAwarded }

        val userIds = members.map { it.userId }
        val users = userRepository.findAllById(userIds)
            .associateBy { it.id }

        //Create leaderboard entries with users, their display names, and corresponding points. Defaults 0 if null
        val leaderboardEntries = members.map { member ->
            val user = requireNotNull(users[member.userId]) {
                "User ${member.userId} was not found"
            }
            LeaderboardEntry(
                userId = member.userId,
                username = user.displayName,
                totalScore = pointsByUser[member.userId] ?: 0
            )
        }.sortedByDescending { it.totalScore }

        return Leaderboard(
            householdId = householdId,
            leaderboard = leaderboardEntries
        )
    }
}