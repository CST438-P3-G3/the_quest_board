package com.example.repository

import com.example.model.Household
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface HouseholdRepository : CrudRepository<Household, UUID> {

}