package com.example.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "household")
data class Household (
    @Id
    val id: UUID,

    @Column(name = "name")
    val name: String,

    @Column(name = "created_by_user_id")
    val createdBy: UUID
)