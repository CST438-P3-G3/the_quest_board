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
}