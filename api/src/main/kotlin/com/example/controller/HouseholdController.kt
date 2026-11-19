package com.example.controller

import com.example.model.Household
import com.example.repository.HouseholdRepository
import com.example.service.HouseholdService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/households")
class HouseholdController (
    private val householdService: HouseholdService,
    private val householdRepository: HouseholdRepository
) {
    //Preauthorize will throw a 401 error if the user is not authenticated
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/my-households")
    fun getHouseholds(): List<Household> {
        val authentication = requireNotNull(
            SecurityContextHolder.getContext().authentication
        ) {
            "No authenticated user found"
        }
        val currentUser: UUID = UUID.fromString(authentication.name)
        val householdIds = householdService.getUsersHouseholdIds(currentUser)

        return householdRepository.findAllById(householdIds).toList()
    }
}