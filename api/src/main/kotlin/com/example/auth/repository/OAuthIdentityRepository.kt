package com.example.auth.repository

import com.example.auth.entity.OAuthIdentity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

// Provides database lookups and saves for provider identities
interface OAuthIdentityRepository : JpaRepository<OAuthIdentity, UUID> {

    // Looks up an identity using the provider and its stable user ID
    fun findByProviderAndProviderSubject(
        provider: String,
        providerSubject: String
    ): OAuthIdentity?

    // Finds the provider identities already linked to an app user
    fun findByUser_Id(userId: UUID): List<OAuthIdentity>
}