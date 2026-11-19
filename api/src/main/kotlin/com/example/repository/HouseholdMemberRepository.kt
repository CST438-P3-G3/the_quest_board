package com.example.repository

import com.example.model.HouseholdMember
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface HouseholdMemberRepository : CrudRepository<HouseholdMember, UUID> {
    //Allows automatic searching by ID
    fun findAllByHouseholdId(householdId: UUID): List<HouseholdMember>

    fun existsByHouseholdId(householdId: UUID): Boolean

    //Retrieves all household members the user is the user id in- This can be used to easily find
    //all households the user is in.
    fun findAllByUserId(userId: UUID) : List<HouseholdMember>
}