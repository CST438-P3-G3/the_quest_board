package com.example.service

import com.example.repository.HouseholdMemberRepository
import java.util.UUID

class HouseholdService (
    private val householdMemberRepository: HouseholdMemberRepository
){
    /*
    Get all the household ids containing the user.
     */
    fun getUsersHouseholdIds(currentUser: UUID) : List<UUID>{
        return householdMemberRepository
            .findAllByUserId(currentUser)
            .map {it.householdId}
    }
}