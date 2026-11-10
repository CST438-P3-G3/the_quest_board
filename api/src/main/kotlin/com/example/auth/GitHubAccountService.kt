package com.example.auth

import com.example.auth.entity.AppUser
import com.example.auth.entity.OAuthIdentity
import com.example.auth.repository.AppUserRepository
import com.example.auth.repository.OAuthIdentityRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class GitHubAccountService(
    private val appUserRepository: AppUserRepository,
    private val oauthIdentityRepository: OAuthIdentityRepository
) {

    // Reuses an existing GitHub account or saves a new verified account
    @Transactional
    fun findOrCreateAccount(identity: VerifiedGitHubIdentity): AppUser {
        val existingGitHubIdentity =
            oauthIdentityRepository.findByProviderAndProviderSubject(
                provider = GITHUB_PROVIDER,
                providerSubject = identity.providerSubject
            )

        // The stable GitHub ID identifies an account that has signed in before
        if (existingGitHubIdentity != null) {
            return existingGitHubIdentity.user
        }

        // Normalize the email so capitalization doesn't create duplicate accounts
        val normalizedEmail = identity.email.trim().lowercase()
        val existingUser = appUserRepository.findByEmailIgnoreCase(normalizedEmail)

        if (existingUser != null) {
            val existingProvider = existingUser.id
                ?.let { oauthIdentityRepository.findByUser_Id(it) }
                ?.firstOrNull()
                ?.provider
                ?: throw IllegalStateException(
                    "An existing app user has no linked OAuth identity."
                )

            throw EmailAlreadyRegisteredException(existingProvider)
        }

        val savedUser = appUserRepository.save(
            AppUser(
                email = normalizedEmail,
                emailVerified = true,
                displayName = identity.displayName,
                systemRole = "USER"
            )
        )

        oauthIdentityRepository.save(
            OAuthIdentity(
                user = savedUser,
                provider = GITHUB_PROVIDER,
                providerSubject = identity.providerSubject
            )
        )

        return savedUser
    }

    private companion object {
        const val GITHUB_PROVIDER = "github"
    }
}

// The API controller will translate this into the contract's 409 response
class EmailAlreadyRegisteredException(
    val existingProvider: String
) : RuntimeException(
    "This email is already registered with $existingProvider."
)