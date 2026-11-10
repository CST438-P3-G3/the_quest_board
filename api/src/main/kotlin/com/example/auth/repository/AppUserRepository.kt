package com.example.auth.repository

import com.example.auth.entity.AppUser
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

// Provides database lookups and saves for app users
interface AppUserRepository : JpaRepository<AppUser, UUID> {

    // Finds an account even if the email's capitalization differs
    fun findByEmailIgnoreCase(email: String): AppUser?
}