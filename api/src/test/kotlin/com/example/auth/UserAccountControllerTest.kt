package com.example.auth

import com.example.model.AppUser
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertEquals
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.springframework.security.oauth2.jwt.Jwt
import java.util.UUID

class UserAccountControllerTest {

    private lateinit var userAccountService: UserAccountService
    private lateinit var controller: UserAccountController

    @BeforeEach
    fun setUp() {
        userAccountService = mock(UserAccountService::class.java)
        controller = UserAccountController(userAccountService)
    }

    @Test
    fun `getCurrentUser returns the signed in user's profile`() {
        val userId = UUID.randomUUID()
        val user = testUser(userId)
        val jwt = testJwt(userId)

        `when`(userAccountService.findById(userId))
            .thenReturn(user)

        val response = controller.getCurrentUser(jwt)

        assertEquals(userId, response.id)
        assertEquals("Original Name", response.displayName)
        assertEquals("member@example.com", response.email)
        assertEquals("Family member", response.accountType)
    }

    @Test
    fun `updateCurrentUser sends the display name to the service`() {
        val userId = UUID.randomUUID()
        val user = testUser(userId)
        val jwt = testJwt(userId)
        val request = com.example.auth.dto.UpdateUserAccountRequest(
            displayName = "Updated Name"
        )

        `when`(userAccountService.updateDisplayName(userId, "Updated Name"))
            .thenReturn(user.apply { displayName = "Updated Name" })

        val response = controller.updateCurrentUser(jwt, request)

        verify(userAccountService).updateDisplayName(userId, "Updated Name")
        assertEquals("Updated Name", response.displayName)
    }

    @Test
    fun `deleteCurrentUser deletes the account identified by the JWT`() {
        val userId = UUID.randomUUID()
        val jwt = testJwt(userId)

        controller.deleteCurrentUser(jwt)

        verify(userAccountService).deleteAccount(userId)
    }

    private fun testJwt(userId: UUID): Jwt {
        return Jwt.withTokenValue("test-token")
            .header("alg", "none")
            .subject(userId.toString())
            .build()
    }

    private fun testUser(userId: UUID): AppUser {
        return AppUser(
            id = userId,
            email = "member@example.com",
            emailVerified = true,
            displayName = "Original Name"
        )
    }
}
