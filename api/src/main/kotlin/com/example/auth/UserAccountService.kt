package com.example.auth

import com.example.auth.entity.AppUser
import com.example.auth.repository.AppUserRepository
import com.example.auth.repository.OAuthIdentityRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class UserAccountService(
    private val appUserRepository: AppUserRepository,
    private val oauthIdentityRepository: OAuthIdentityRepository
) {

    // Finds the signed in user by the ID stored in the JWT subject
    fun findById(userId: UUID): AppUser {
        return appUserRepository.findById(userId).orElseThrow {
            UserAccountNotFoundException()
        }
    }

    // Updates the user's editable profile information
    @Transactional
    fun updateDisplayName(
        userId: UUID,
        displayName: String
    ): AppUser {
        val cleanedDisplayName = displayName.trim()

        // Prevent empty display names from being saved
        require(cleanedDisplayName.isNotEmpty()) {
            "Display name cannot be empty."
        }

        // Keep the database field within its maximum length
        require(cleanedDisplayName.length <= 120) {
            "Display name cannot be longer than 120 characters."
        }

        val user = findById(userId)

        // Update only the field that the user is allowed to change
        user.displayName = cleanedDisplayName

        return appUserRepository.save(user)
    }

    // Deletes the user and the linked OAuth identity
    @Transactional
    fun deleteAccount(userId: UUID) {
        val user = findById(userId)

        // Delete linked provider records before deleting the user
        // This avoids a foreign key error from oauth_identity
        val identities = oauthIdentityRepository.findByUser_Id(userId)

        oauthIdentityRepository.deleteAll(identities)

        // Delete the Quest Board account
        appUserRepository.delete(user)
    }
}

// Used when the JWT points to an account that no longer exists
class UserAccountNotFoundException : RuntimeException(
    "The user account could not be found."
)