package com.example.auth

import com.example.auth.dto.GitHubSignInRequest
import com.example.auth.dto.SignInResponse
import com.example.auth.dto.UserSummary
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

// Handles the app's GitHub sign in request
@RestController
@RequestMapping("/auth")
class GitHubAuthController(
    private val gitHubOAuthClient: GitHubOAuthClient,
    private val gitHubProfileClient: GitHubProfileClient,
    private val gitHubAccountService: GitHubAccountService,
    private val jwtTokenService: JwtTokenService
) {
    // Exchanges the code from GitHub for an API token and user details.
    @PostMapping("/github")
    fun signIn(@RequestBody request: GitHubSignInRequest): SignInResponse {
        // Exchange the one time authorization code for a GitHub access token.
        val githubAccessToken =
            gitHubOAuthClient.exchangeAuthorizationCode(request)

        // Use that token to fetch the user's verified GitHub identity
        val identity =
            gitHubProfileClient.fetchVerifiedIdentity(githubAccessToken)

        // Find the matching app account or create one for this GitHub identity
        val user =
            gitHubAccountService.findOrCreateAccount(identity)

        // Create the short lived token that the app will use with this API
        val jwt = jwtTokenService.issueFor(user)

        // Return the API token and the user's public account details
        return SignInResponse(
            accessToken = jwt.accessToken,
            expiresIn = jwt.expiresIn,
            user = UserSummary(
                id = requireNotNull(user.id),
                displayName = user.displayName,
                email = user.email
            )
        )
    }
}