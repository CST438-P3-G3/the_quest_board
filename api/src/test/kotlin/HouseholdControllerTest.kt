package com.example

import com.example.controller.HouseholdController
import com.example.model.AppUser
import com.example.model.Household
import com.example.model.HouseholdMember
import com.example.repository.HouseholdRepository
import com.example.service.HouseholdService
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@WebMvcTest(HouseholdController::class)
@AutoConfigureMockMvc
@Import(LeaderboardServiceTest.TestSecurityConfig::class)
class HouseholdControllerTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var householdService: HouseholdService

    @MockitoBean
    private lateinit var householdRepository: HouseholdRepository

    //Generate mock uuids for testing
    fun mockUuid(id: Int): java.util.UUID {
        val paddedId = id.toString().padStart(12, '0')
        return java.util.UUID.fromString("00000000-0000-0000-0000-$paddedId")
    }

    @Test
    fun `Attempting to view your households while not signed in throws a 401 error`(){
        mockMvc.perform(
            get("/households/my-households")
        )
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun `A list of your households is properly returned if you are authenticated`() {
        //Assigned separately to prevent the IDE from worrying about the appUser field's
        //nullability later
        val userId = mockUuid(1)

        val mockUser = AppUser(
            userId,
            "placeholder@placeholder.com",
            true,
            "Bunny",
            "USER"
        )

        val mockHousehold1 = Household(
            mockUuid(1),
            "Hay Eaters",
            mockUuid(1)
        )

        val mockHousehold2 = Household(
            mockUuid(2),
            "Celery Enjoyers",
            mockUuid(2)
        )

        val mockHousehold3 = Household(
            mockUuid(3),
            "We like to dig",
            mockUuid(3)
        )

        // Put the mock user in the households
        val householdMember1 = HouseholdMember(
            mockUuid(1), mockUuid(1), mockUuid(1)
        )

        val householdMember2 = HouseholdMember(
            mockUuid(2), mockUuid(2), mockUuid(1)
        )

        val householdMember3 = HouseholdMember(
            mockUuid(3), mockUuid(3), mockUuid(1)
        )

        // Mock the service response
        Mockito.`when`(
            householdService.getUsersHouseholdIds(userId)
        ).thenReturn(
            listOf(mockUuid(1), mockUuid(2), mockUuid(3))
        )

        // Mock the repository response
        Mockito.`when`(
            householdRepository.findAllById(
                listOf(mockUuid(1), mockUuid(2), mockUuid(3))
            )
        ).thenReturn(
            listOf(
                mockHousehold1,
                mockHousehold2,
                mockHousehold3
            )
        )

        // Make the request
        mockMvc.perform(
            get("/households/my-households")
                .with(user(mockUser.id.toString()))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value(mockUuid(1).toString()))
            .andExpect(jsonPath("$[0].name").value("Hay Eaters"))
            .andExpect(jsonPath("$[1].id").value(mockUuid(2).toString()))
            .andExpect(jsonPath("$[1].name").value("Celery Enjoyers"))
            .andExpect(jsonPath("$[2].id").value(mockUuid(3).toString()))
            .andExpect(jsonPath("$[2].name").value("We like to dig"))
    }
    //As these tests are dependent on the signed in user, 400 and 403 do not apply
}