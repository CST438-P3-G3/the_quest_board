package com.example

import org.springframework.http.HttpStatus
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import org.springframework.transaction.annotation.Transactional
import java.sql.ResultSet
import java.time.Instant
import java.util.UUID

data class CreateOrganizationRequest(
    val name: String,
    val description: String = "",
    val websiteUrl: String? = null
)

data class OrganizationResponse(
    val id: UUID,
    val name: String,
    val description: String,
    val websiteUrl: String?,
    val role: String,
    val createdAt: Instant
)

@RestController
@RequestMapping("/organizations")
class OrganizationController(private val jdbc: JdbcTemplate) {

    @GetMapping
    fun list(@AuthenticationPrincipal jwt: Jwt): List<OrganizationResponse> {
        val userId = authenticatedUserId(jwt)
        return jdbc.query(
            """SELECT o.id, o.name, o.description, o.website_url, m.role, o.created_at
               FROM organizations o
               JOIN organization_membership m ON m.organization_id = o.id
               WHERE m.user_id = ?
               ORDER BY o.created_at DESC""",
            { rs, _ -> rs.toOrganizationResponse() },
            userId
        )
    }

    @PostMapping
    @Transactional
    fun create(
        @AuthenticationPrincipal jwt: Jwt,
        @RequestBody request: CreateOrganizationRequest
    ): OrganizationResponse {
        val name = request.name.trim()
        val description = request.description.trim()
        val website = request.websiteUrl?.trim()?.takeIf(String::isNotEmpty)
        if (name.isEmpty()) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Organization name is required.")
        if (name.length > 120) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Organization name must be 120 characters or fewer.")
        if (description.length > 1000) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Description must be 1000 characters or fewer.")
        if (website != null && (website.length > 300 || !website.matches(Regex("https?://.+")))) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Website must be a valid http:// or https:// URL.")
        }

        val userId = authenticatedUserId(jwt)
        val organizationId = UUID.randomUUID()
        jdbc.update(
            "INSERT INTO organizations (id, name, description, website_url, created_by) VALUES (?, ?, ?, ?, ?)",
            organizationId, name, description, website, userId
        )
        jdbc.update(
            "INSERT INTO organization_membership (organization_id, user_id, role) VALUES (?, ?, 'OWNER')",
            organizationId, userId
        )

        return jdbc.queryForObject(
            """SELECT o.id, o.name, o.description, o.website_url, m.role, o.created_at
               FROM organizations o JOIN organization_membership m ON m.organization_id = o.id
               WHERE o.id = ? AND m.user_id = ?""",
            { rs, _ -> rs.toOrganizationResponse() },
            organizationId, userId
        )!!
    }

    private fun authenticatedUserId(jwt: Jwt): UUID = try {
        UUID.fromString(jwt.subject)
    } catch (_: IllegalArgumentException) {
        throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid account token.")
    }

    private fun ResultSet.toOrganizationResponse() = OrganizationResponse(
        id = getObject("id", UUID::class.java),
        name = getString("name"),
        description = getString("description"),
        websiteUrl = getString("website_url"),
        role = getString("role"),
        createdAt = getTimestamp("created_at").toInstant()
    )
}
