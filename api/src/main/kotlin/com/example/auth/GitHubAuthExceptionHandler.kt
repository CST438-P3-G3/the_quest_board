package com.example.auth

import com.example.auth.dto.ProblemDetails
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

// Converts sign in exceptions into the error response format in the API contract
@RestControllerAdvice
class GitHubAuthExceptionHandler {

    // Returns 409 when the verified email already belongs to another provider
    @ExceptionHandler(EmailAlreadyRegisteredException::class)
    fun handleEmailAlreadyRegistered(
        exception: EmailAlreadyRegisteredException
    ): ResponseEntity<ProblemDetails> {
        val status = HttpStatus.CONFLICT

        val problem = ProblemDetails(
            type = "https://the-quest-board.example/problems/email-already-registered",
            title = "Email already registered",
            status = status.value(),
            detail = "This email is already registered with ${exception.existingProvider}."
        )

        return ResponseEntity
            .status(status)
            .contentType(MediaType.valueOf("application/problem+json"))
            .body(problem)
    }

    // Returns 401 when GitHub rejects sign in or the email is not verified
    @ExceptionHandler(GitHubSignInRejectedException::class)
    fun handleGitHubSignInRejected(
        exception: GitHubSignInRejectedException
    ): ResponseEntity<ProblemDetails> {
        val status = HttpStatus.UNAUTHORIZED

        val problem = ProblemDetails(
            type = "https://the-quest-board.example/problems/github-sign-in-rejected",
            title = "GitHub sign-in rejected",
            status = status.value(),
            detail = exception.message
        )

        return ResponseEntity
            .status(status)
            .contentType(MediaType.APPLICATION_PROBLEM_JSON)
            .body(problem)
    }
}