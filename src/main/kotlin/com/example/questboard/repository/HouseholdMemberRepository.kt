package com.example.questboard.repository

import com.example.questboard.model.HouseholdMember
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface HouseholdMemberRepository : CrudRepository<HouseholdMember, UUID> {
    //Allows automatic searching by ID
    fun findAllByHouseholdId(householdId: UUID): List<HouseholdMember>
}