package com.example.questboard

import com.example.questboard.controller.LeaderboardController
import com.example.questboard.model.HouseholdMember
import com.example.questboard.model.Leaderboard
import com.example.questboard.model.LeaderboardEntry
import com.example.questboard.model.Task
import com.example.questboard.model.TaskCompletion
import com.example.questboard.model.User
import com.example.questboard.service.LeaderboardService
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.junit.jupiter.api.BeforeEach
import org.springframework.context.annotation.Bean
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.web.server.ResponseStatusException

@WebMvcTest(LeaderboardController::class)
@AutoConfigureMockMvc
@Import(LeaderboardServiceTest.TestSecurityConfig::class)
class LeaderboardServiceTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var leaderboardService: LeaderboardService
    private lateinit var mockUser1: User
    private lateinit var mockUser2: User
    private lateinit var mockUser3: User
    private lateinit var mockUser4: User
    private lateinit var mockHouseholdMember1: HouseholdMember
    private lateinit var mockHouseholdMember2: HouseholdMember
    private lateinit var mockHouseholdMember3: HouseholdMember

    private lateinit var task1: Task
    private lateinit var task2: Task
    private lateinit var task3: Task
    private lateinit var task4: Task
    private lateinit var task5: Task
    private lateinit var task6: Task

    private lateinit var taskC1: TaskCompletion
    private lateinit var taskC2: TaskCompletion
    private lateinit var taskC3: TaskCompletion
    private lateinit var taskC4: TaskCompletion
    private lateinit var taskC5: TaskCompletion

    @TestConfiguration
    @EnableWebSecurity
    class TestSecurityConfig {

        @Bean
        fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
            http
                .authorizeHttpRequests {
                    it.anyRequest().permitAll()
                }
                .exceptionHandling {
                    it.authenticationEntryPoint(
                        HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
                    )
                }

            return http.build()
        }
    }

    //Generate mock uuids for testing
    fun mockUuid(id: Int): java.util.UUID {
        val paddedId = id.toString().padStart(12, '0')
        return java.util.UUID.fromString("00000000-0000-0000-0000-$paddedId")
    }

    //Set up mock users, tasks, and household members, which are used in all tests
    @BeforeEach
    fun setUp() {
        //Create mock users
        mockUser1 = User(mockUuid(1), "emailUser1", true, "User1", "ADMIN")
        mockUser2 = User(mockUuid(2), "emailUser2", true, "User2", "USER")
        mockUser3 = User(mockUuid(3), "emailUser3", true, "User3", "USER")
        mockUser4 = User(mockUuid(4), "emailUser4", true, "User4", "USER")

        //Add mock users to household with householdId 1 remaining constant
        mockHouseholdMember1 = HouseholdMember(mockUuid(1), mockUuid(1), mockUuid(1))
        mockHouseholdMember2 = HouseholdMember(mockUuid(2), mockUuid(1), mockUuid(2))
        mockHouseholdMember3 = HouseholdMember(mockUuid(3), mockUuid(1), mockUuid(3))

        //Create mock tasks, 2 per user for now for the tests. Foreign keys remain constant here aside from user assignments. Fields that are not relevant to leaderboard ranking are empty.
        task1 = Task(mockUuid(1), mockUuid(1), mockUuid(1), mockUuid(1), "Task A1", "", 15, "")
        task2 = Task(mockUuid(2), mockUuid(1), mockUuid(1), mockUuid(1), "Task A2", "", 5, "")
        task3 = Task(mockUuid(3), mockUuid(1), mockUuid(1), mockUuid(2), "Task B1", "", 8, "")
        task4 = Task(mockUuid(4), mockUuid(1), mockUuid(1), mockUuid(2), "Task B2", "", 5, "")
        task5 = Task(mockUuid(5), mockUuid(1), mockUuid(1), mockUuid(3), "Task C1", "", 9, "")
        task6 = Task(mockUuid(6), mockUuid(1), mockUuid(1), mockUuid(3), "Task C2", "", 3, "")

        //Finally, create task completion table
        //The household members should have 20, 13, and 9 points respectively with these assignments.
        taskC1 = TaskCompletion(mockUuid(1), mockUuid(1), mockUuid(1), task1.pointValue)
        taskC2 = TaskCompletion(mockUuid(2), mockUuid(2), mockUuid(1), task2.pointValue)
        taskC3 = TaskCompletion(mockUuid(3), mockUuid(3), mockUuid(2), task3.pointValue)
        taskC4 = TaskCompletion(mockUuid(4), mockUuid(4), mockUuid(2), task4.pointValue)
        taskC5 = TaskCompletion(mockUuid(5), mockUuid(5), mockUuid(3), task5.pointValue)
    }

    @Test
    fun `Attempting to retrieve a leaderboard while not signed in throws a 401 error`(){
        mockMvc.perform(
            get("/leaderboard/${mockUuid(1)}")
        )
            .andExpect(status().isUnauthorized)
    }

    @Test
    @WithMockUser(username = "user1", roles = ["USER"])
    fun `Attempting to retrieve a leaderboard with a malformed leaderboard UUID throws a 400 error`(){
        mockMvc.perform(
            get("/leaderboard/bobibabibababa")
        )
            .andExpect(status().isBadRequest)
    }

    @Test
    fun `Attempting to retrieve a leaderboard with a UUID that is not found throws a 404 error`() {
        Mockito.`when`(
            leaderboardService.getLeaderboard(mockUuid(99), mockUuid(1))
        ).thenThrow(ResponseStatusException(HttpStatus.NOT_FOUND))

        mockMvc.perform(
            get("/leaderboard/${mockUuid(99)}")
                .with(user(mockUuid(1).toString()))
        )
            .andExpect(status().isNotFound)
    }

    @Test
    fun `Attempting to retrieve a leaderboard while not being part of the household or an admin throws a 403 error`(){
        Mockito.`when`(
            leaderboardService.getLeaderboard(mockUuid(1), mockUuid(4))
        ).thenThrow(ResponseStatusException(HttpStatus.FORBIDDEN))

        mockMvc.perform(
            get("/leaderboard/${mockUuid(1)}")
                .with(user(mockUuid(4).toString()))
        )
            .andExpect(status().isForbidden)
    }

    @Test
    fun `Attempting to retrieve a leaderboard with a valid UUID and members retrieves a correctly sorted leaderboard`(){
        val householdId = mockUuid(1)
        val userId = mockUuid(1)

        val expectedLeaderboard = Leaderboard(
            householdId = householdId,
            leaderboard = listOf(
                LeaderboardEntry(userId = mockUuid(1), username = "User1", totalScore = 20),
                LeaderboardEntry(userId = mockUuid(2), username = "User2", totalScore = 13),
                LeaderboardEntry(userId = mockUuid(3), username = "User3", totalScore = 9)
            )
        )

        Mockito.`when`(
            leaderboardService.getLeaderboard(householdId, userId)
        ).thenReturn(expectedLeaderboard)

        val result = mockMvc.perform(
            get("/leaderboard/$householdId")
                .with(user(userId.toString()))
        )

        result
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.leaderboard[0].username").value("User1"))
            .andExpect(jsonPath("$.leaderboard[0].totalScore").value(20))
            .andExpect(jsonPath("$.leaderboard[1].username").value("User2"))
            .andExpect(jsonPath("$.leaderboard[1].totalScore").value(13))
            .andExpect(jsonPath("$.leaderboard[2].username").value("User3"))
            .andExpect(jsonPath("$.leaderboard[2].totalScore").value(9))
   }
}