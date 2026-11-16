package com.example.auth.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

// Maps this Kotlin class to the app_user table created by the migration
@Entity
@Table(name = "app_user")
open class AppUser(

    // Hibernate assigns a UUID when the new account is saved
    @field:Id
    @field:GeneratedValue(strategy = GenerationType.UUID)
    @field:Column(name = "id", nullable = false, updatable = false)
    open var id: UUID? = null,

    // The database migration requires each account to have a unique email
    @field:Column(name = "email", nullable = false, unique = true, length = 320)
    open var email: String,

    // This is true only after GitHub confirms the email is verified
    @field:Column(name = "email_verified", nullable = false)
    open var emailVerified: Boolean,

    // The name shown to other users in The Quest Board
    @field:Column(name = "display_name", nullable = false, length = 120)
    open var displayName: String,

    // New accounts start with the standard user role
    @field:Column(name = "system_role", nullable = false, length = 32)
    open var systemRole: String = "USER"
)