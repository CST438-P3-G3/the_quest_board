package com.example.auth

import com.example.auth.entity.AppUser
import com.example.auth.entity.OAuthIdentity
import com.example.auth.repository.AppUserRepository
import com.example.auth.repository.OAuthIdentityRepository
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.inOrder
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import java.util.Optional
import java.util.UUID

class UserAccountServiceTest {

    private lateinit var appUserRepository: AppUserRepository
    private lateinit var oauthIdentityRepository: OAuthIdentityRepository
    private lateinit var service: UserAccountService

    @BeforeEach
    fun setUp() {
        appUserRepository = mock(AppUserRepository::class.java)
        oauthIdentityRepository = mock(OAuthIdentityRepository::class.java)
        service = UserAccountService(
            appUserRepository = appUserRepository,
            oauthIdentityRepository = oauthIdentityRepository
        )
    }

    @Test
    fun `findById returns the matching account`() {
        val userId = UUID.randomUUID()
        val user = testUser(userId)

        `when`(appUserRepository.findById(userId))
            .thenReturn(Optional.of(user))

        val result = service.findById(userId)

        assertEquals(user, result)
    }

    @Test
    fun `findById throws when the account does not exist`() {
        val userId = UUID.randomUUID()

        `when`(appUserRepository.findById(userId))
            .thenReturn(Optional.empty())

        assertThrows<UserAccountNotFoundException> {
            service.findById(userId)
        }
    }

    @Test
    fun `updateDisplayName trims and saves the new display name`() {
        val userId = UUID.randomUUID()
        val user = testUser(userId)

        `when`(appUserRepository.findById(userId))
            .thenReturn(Optional.of(user))
        `when`(appUserRepository.save(user))
            .thenReturn(user)

        val result = service.updateDisplayName(userId, "  Updated Name  ")

        assertEquals("Updated Name", result.displayName)
        verify(appUserRepository).save(user)
    }

    @Test
    fun `updateDisplayName rejects an empty display name`() {
        val userId = UUID.randomUUID()

        assertThrows<IllegalArgumentException> {
            service.updateDisplayName(userId, "   ")
        }
    }

    @Test
    fun `updateDisplayName rejects a display name longer than 120 characters`() {
        val userId = UUID.randomUUID()
        val longDisplayName = "a".repeat(121)

        assertThrows<IllegalArgumentException> {
            service.updateDisplayName(userId, longDisplayName)
        }
    }

    @Test
    fun `deleteAccount removes linked identities before removing the account`() {
        val userId = UUID.randomUUID()
        val user = testUser(userId)
        val identity = OAuthIdentity(
            user = user,
            provider = "github",
            providerSubject = "github-user-123"
        )

        `when`(appUserRepository.findById(userId))
            .thenReturn(Optional.of(user))
        `when`(oauthIdentityRepository.findByUser_Id(userId))
            .thenReturn(listOf(identity))

        service.deleteAccount(userId)

        val order = inOrder(oauthIdentityRepository, appUserRepository)
        order.verify(oauthIdentityRepository).deleteAll(listOf(identity))
        order.verify(appUserRepository).delete(user)
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
