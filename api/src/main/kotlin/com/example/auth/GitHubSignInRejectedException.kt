package com.example.auth

// Thrown when GitHub cannot verify the credentials or email for sign in
class GitHubSignInRejectedException(message: String) : RuntimeException(message)