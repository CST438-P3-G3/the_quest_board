package com.example.auth

import com.example.auth.dto.UpdateUserAccountRequest
import com.example.auth.dto.UserAccountResponse
import com.example.model.AppUser
import org.springframework.http.HttpStatus
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class UserAccountController(
    private val userAccountService: UserAccountService
) {

    // Returns the currently signed in user's account information
    @GetMapping("/user/me")
    fun getCurrentUser(
        @AuthenticationPrincipal jwt: Jwt
    ): UserAccountResponse {
        val user = userAccountService.findById(jwt.userId())

        return user.toAccountResponse()
    }

    // Updates the currently signed in user's display name
    @PatchMapping("/user/me")
    fun updateCurrentUser(
        @AuthenticationPrincipal jwt: Jwt,
        @RequestBody request: UpdateUserAccountRequest
    ): UserAccountResponse {
        val user = userAccountService.updateDisplayName(
            userId = jwt.userId(),
            displayName = request.displayName
        )

        return user.toAccountResponse()
    }

    // Deletes the currently signed in user's account
    @DeleteMapping("/users/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteCurrentUser(
        @AuthenticationPrincipal jwt: Jwt
    ) {
        userAccountService.deleteAccount(jwt.userId())
    }

    // Converts the JWT subject into the database user ID
    private fun Jwt.userId(): UUID {
        return UUID.fromString(subject)
    }

    // Converts the database entity into a safe API response
    private fun AppUser.toAccountResponse(): UserAccountResponse {
        return UserAccountResponse(
            id = requireNotNull(id),
            displayName = displayName,
            email = email,
            accountType = "Family member"
        )
    }
}
