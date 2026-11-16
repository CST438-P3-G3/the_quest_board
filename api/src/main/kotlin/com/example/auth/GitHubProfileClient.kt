package com.example.auth

import org.springframework.http.HttpHeaders
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient

// Fetches the signed in user's profile and verified email from GitHub
@Component
class GitHubProfileClient {

    private val restClient = RestClient.builder()
        .baseUrl("https://api.github.com")
        .defaultHeader(HttpHeaders.ACCEPT, "application/vnd.github+json")
        .defaultHeader("X-GitHub-Api-Version", "2026-03-10")
        .build()

    // Returns the stable GitHub ID, display name, and a verified email
    fun fetchVerifiedIdentity(accessToken: String): VerifiedGitHubIdentity {
        val user = restClient.get()
            .uri("/user")
            .header(HttpHeaders.AUTHORIZATION, "Bearer $accessToken")
            .retrieve()
            .body(GitHubUserResponse::class.java)
            ?: throw GitHubSignInRejectedException("GitHub did not return a user profile.")

        val emails = restClient.get()
            .uri("/user/emails?per_page=100")
            .header(HttpHeaders.AUTHORIZATION, "Bearer $accessToken")
            .retrieve()
            .body(Array<GitHubEmailResponse>::class.java)
            ?: throw GitHubSignInRejectedException("GitHub did not return email addresses.")

        // Prefer the verified primary email otherwise use another verified address
        val verifiedEmail = emails.firstOrNull { it.primary && it.verified }
            ?: emails.firstOrNull { it.verified }
            ?: throw GitHubSignInRejectedException("GitHub account has no verified email address.")

        return VerifiedGitHubIdentity(
            providerSubject = user.id.toString(),
            displayName = user.name?.takeIf { it.isNotBlank() } ?: user.login,
            email = verifiedEmail.email
        )
    }
}

// Fields needed from GitHub's authenticated user response
data class GitHubUserResponse(
    val id: Long,
    val login: String,
    val name: String? = null
)

// Fields needed from GitHub's email address response
data class GitHubEmailResponse(
    val email: String,
    val primary: Boolean = false,
    val verified: Boolean = false
)

// The GitHub identity details the sign in service will use
data class VerifiedGitHubIdentity(
    val providerSubject: String,
    val displayName: String,
    val email: String
)