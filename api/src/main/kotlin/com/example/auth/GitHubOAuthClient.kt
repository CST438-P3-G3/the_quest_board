package com.example.auth

import com.example.auth.dto.GitHubSignInRequest
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.RestClient


// Sends the authorization code to GitHub and receives a GitHub access token
@Component
class GitHubOAuthClient(
    // These values come from environment variables, not from source code
    @Value("\${GITHUB_CLIENT_ID:}")
    private val clientId: String,

    @Value("\${GITHUB_CLIENT_SECRET:}")
    private val clientSecret: String
) {
    private val restClient = RestClient.create()


    // Exchanges the code, verifier, and redirect URI for a GitHub access token
    fun exchangeAuthorizationCode(request: GitHubSignInRequest): String {
        check(clientId.isNotBlank() && clientSecret.isNotBlank()) {
            "GitHub OAuth credentials are not configured."
        }

        // GitHub expects these values as parameters in the token request
        val form = LinkedMultiValueMap<String, String>().apply {
            add("client_id", clientId)
            add("client_secret", clientSecret)
            add("code", request.code)
            add("code_verifier", request.codeVerifier)
            add("redirect_uri", request.redirectUri)
        }

        val tokenResponse = restClient.post()
            .uri("https://github.com/login/oauth/access_token")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .accept(MediaType.APPLICATION_JSON)
            .body(form)
            .retrieve()
            .body(GitHubTokenResponse::class.java)

        // If GitHub returned an error instead of a token, don't treat sign-in as successful
        return tokenResponse?.access_token
            ?: throw GitHubSignInRejectedException("GitHub did not return a user profile")
    }

    // Fields returned by GitHub's token endpoint
    private data class GitHubTokenResponse(
        val access_token: String? = null,
        val error: String? = null,
        val error_description: String? = null
    )
}