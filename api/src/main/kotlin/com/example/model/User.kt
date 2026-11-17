package com.example.model

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import java.util.UUID

data class User (
    @Id
    val id: UUID,
    @Column("email")
    val email: String,
    @Column("email_verified")
    val emailVerified: Boolean,
    @Column("display_name")
    val displayName: String,
    @Column("system_role")
    val systemRole: String
)