package com.example

import com.example.controller.HouseholdController
import com.example.repository.HouseholdRepository
import com.example.service.HouseholdService
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
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

    @Test
    fun `Attempting to view your households while not signed in throws a 401 error`(){
        mockMvc.perform(
            get("/households/my-households")
        )
            .andExpect(status().isUnauthorized)
    }

    //As these tests are dependent on the signed in user, 400 and 403 do not apply
}