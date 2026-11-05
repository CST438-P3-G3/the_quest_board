# Entity Relationship Diagram

This diagram shows the account, household, task, and completion data for The Quest Board. The GitHub sign in endpoint returns account details from `APP_USER`.

## ERD

```mermaid
erDiagram
    APP_USER ||--o{ OAUTH_IDENTITY : signs_in_with
    APP_USER ||--o{ HOUSEHOLD : creates
    APP_USER ||--o| HOUSEHOLD_MEMBER : joins
    HOUSEHOLD ||--|{ HOUSEHOLD_MEMBER : includes
    HOUSEHOLD ||--o{ TASK : contains
    APP_USER ||--o{ TASK : creates
    APP_USER o|--o{ TASK : assigned_to
    TASK ||--o| TASK_COMPLETION : has_completion
    APP_USER ||--o{ TASK_COMPLETION : completes

    APP_USER {
        uuid id PK
        string email UK
        boolean email_verified
        string display_name
        string system_role
    }

    OAUTH_IDENTITY {
        uuid id PK
        uuid user_id FK
        string provider
        string provider_subject
    }

    HOUSEHOLD {
        uuid id PK
        string name
        uuid created_by_user_id FK
    }

    HOUSEHOLD_MEMBER {
        uuid id PK
        uuid household_id FK
        uuid user_id FK
    }

    TASK {
        uuid id PK
        uuid household_id FK
        uuid created_by_user_id FK
        uuid assignee_user_id FK
        string name
        string description
        int point_value
        datetime due_at
        string location
    }

    TASK_COMPLETION {
        uuid id PK
        uuid task_id FK
        uuid completed_by_user_id FK
        int points_awarded
        datetime completed_at
    }