package com.example.auth.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import java.util.UUID

// Maps a provider account to the Quest Board user who signed in with it
@Entity
@Table(
    name = "oauth_identity",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uq_oauth_identity_provider_subject",
            columnNames = ["provider", "provider_subject"]
        )
    ]
)
open class OAuthIdentity(

    // Hibernate assigns an ID when this identity is saved
    @field:Id
    @field:GeneratedValue(strategy = GenerationType.UUID)
    @field:Column(name = "id", nullable = false, updatable = false)
    open var id: UUID? = null,

    // The Quest Board account this provider identity belongs to
    @field:ManyToOne(fetch = FetchType.LAZY, optional = false)
    @field:JoinColumn(name = "user_id", nullable = false)
    open var user: AppUser,

    // The provider name
    @field:Column(name = "provider", nullable = false, length = 32)
    open var provider: String,

    // The stable user ID returned by the provider
    @field:Column(name = "provider_subject", nullable = false, length = 255)
    open var providerSubject: String
)