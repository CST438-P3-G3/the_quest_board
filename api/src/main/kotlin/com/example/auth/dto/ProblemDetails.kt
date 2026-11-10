package com.example.auth.dto

// Required fields for the error responses described by the Problem schema in docs/openapi.yaml.
data class ProblemDetails(
    // URI that identifies the kind of problem
    val type: String,

    // Short human readable summary of the problem
    val title: String,

    // HTTP status code, such as 400 or 401
    val status: Int,

    // Extra information that helps explain this specific problem.
    val detail: String? = null
)