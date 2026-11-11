package com.example.questboard.repository

import com.example.questboard.model.HouseholdMember
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface HouseholdMemberRepository : CrudRepository<HouseholdMember, Long> {
    //Allows automatic searching by ID
}