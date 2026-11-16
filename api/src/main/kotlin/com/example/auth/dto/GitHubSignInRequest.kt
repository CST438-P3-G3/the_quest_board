package com.example.auth.dto

// Represents the JSON body sent to POST /auth/github
data class GitHubSignInRequest(
    // One time authorization code returned by GitHub
    val code: String,

    // PKCE verifier created by the app before GitHub sign in
    val codeVerifier: String,

    // Redirect URI used when the app started the GitHub sign in flow
    val redirectUri: String
)