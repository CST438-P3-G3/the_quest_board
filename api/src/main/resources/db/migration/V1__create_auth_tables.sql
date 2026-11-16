-- Stores the app account returned after sign in
CREATE TABLE app_user (
    id UUID PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    display_name VARCHAR(120) NOT NULL,
    system_role VARCHAR(32) NOT NULL DEFAULT 'USER',

    CONSTRAINT chk_app_user_system_role
        CHECK (system_role IN ('USER', 'ADMIN'))
);

-- Links an app account to its GitHub or Google account
CREATE TABLE oauth_identity (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    provider VARCHAR(32) NOT NULL,
    provider_subject VARCHAR(255) NOT NULL,

    CONSTRAINT fk_oauth_identity_user
        FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE,

    CONSTRAINT uq_oauth_identity_provider_subject
        UNIQUE (provider, provider_subject),

    CONSTRAINT chk_oauth_identity_provider
        CHECK (provider IN ('github', 'google'))
);

-- Supports looking up a user's linked provider identities
CREATE INDEX idx_oauth_identity_user_id
    ON oauth_identity(user_id);