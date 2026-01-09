# user-authentication - Spec

## Problem

Compass currently has no authentication system, making it unsuitable for multi-user environments or deployment beyond a single trusted user. Any person with access to the application URL can view, modify, or delete all project data including sensitive client information, compliance documents, and financial details.

Agencies and consulting firms require secure access control to:
- Protect client confidentiality
- Enable multiple team members to use the application
- Maintain audit trails of who made changes
- Support future role-based access control

## In scope

- Email/password authentication using Supabase Auth
- User registration with email verification
- Login/logout functionality
- Protected routes (redirect unauthenticated users to login)
- Password reset flow via email
- Session persistence (stay logged in across browser sessions)
- User profile display in header (name/email, avatar placeholder)
- Auth context provider for React components
- Row-level security (RLS) policies on all database tables

## Out of scope

- Social login providers (Google, Microsoft, etc.) - future enhancement
- Role-based access control (admin vs user) - future enhancement
- Team/organization management - future enhancement
- Two-factor authentication (2FA) - future enhancement
- Single sign-on (SSO) integration - future enhancement
- User invitation system - future enhancement
- Audit logging of authentication events - separate feature

## User stories

- As a team member, I want to log in with my email and password, so that I can securely access project data.
- As a new user, I want to register an account, so that I can start using Compass.
- As a user, I want my session to persist, so that I don't have to log in every time I open the app.
- As a user who forgot my password, I want to reset it via email, so that I can regain access to my account.
- As a user, I want to see my profile information in the header, so that I know I'm logged in to the correct account.
- As a user, I want to log out, so that I can secure my session on shared devices.

## Acceptance criteria

- [x] **AC-1**: Given an unauthenticated user, when they navigate to any protected route, then they are redirected to `/login`
- [x] **AC-2**: Given a user on the login page, when they enter valid credentials and submit, then they are authenticated and redirected to the dashboard
- [x] **AC-3**: Given a user on the login page, when they enter invalid credentials, then they see an error message and remain on the login page
- [x] **AC-4**: Given a user on the registration page, when they submit valid email and password, then an account is created and verification email is sent
- [x] **AC-5**: Given a logged-in user, when they click logout, then their session is terminated and they are redirected to `/login`
- [x] **AC-6**: Given a logged-in user, when they close and reopen the browser, then they remain authenticated (session persistence)
- [x] **AC-7**: Given a user on the forgot password page, when they submit their email, then a password reset link is sent to their email
- [x] **AC-8**: Given a user with a reset link, when they click it and set a new password, then their password is updated and they can log in
- [x] **AC-9**: Given RLS is enabled, when an unauthenticated request hits the database directly, then it is rejected

## Priority

- [x] P0 - Critical (blocks release)

## Effort estimate

- [x] M (1-3 days)

## Dependencies

- **Requires:** Supabase project with Auth enabled (already configured per documentation)
- **Blocks:** role-based-access-control, team-management, user-invitations

## Success metrics

- 100% of routes are protected (no public data access)
- Zero unauthorized database access attempts succeed
- Password reset flow completes successfully in under 2 minutes
- Session persistence works across browser restarts

## Open questions

- [x] **Non-blocking:** Should existing data be associated with a default "admin" user upon migration, or left unassigned?
- [x] **Non-blocking:** What is the minimum password complexity requirement? (Default: 8+ characters)
