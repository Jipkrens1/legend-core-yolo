# Security Scan

Scan a feature's implementation for security vulnerabilities.

## Instructions

1. Determine the feature slug from user input
2. Read feature artifacts:
   - `legend/features/<slug>.design.md` - security considerations
   - `legend/features/<slug>.implementation.md` - files to scan
3. Identify files changed in implementation

4. Run security checks:

### Secret Detection
- [ ] No API keys hardcoded
- [ ] No passwords in code
- [ ] No private keys or certificates
- [ ] No connection strings with credentials
- [ ] .env files are gitignored

### Input Validation
- [ ] User input validated before use
- [ ] SQL queries use parameterized statements
- [ ] No raw HTML rendering (XSS prevention)
- [ ] File uploads validated and sanitized
- [ ] URL parameters validated

### Authentication/Authorization
- [ ] Protected routes check authentication
- [ ] Authorization checks before sensitive operations
- [ ] Session tokens securely generated
- [ ] Password hashing uses bcrypt/argon2
- [ ] Rate limiting on auth endpoints

### Supabase/RLS Specific
- [ ] RLS enabled on all tables with user data
- [ ] Policies match design document
- [ ] No service_role key in frontend
- [ ] Anon key only used for public operations

### Dependency Vulnerabilities
- Run: `npm audit` or `pnpm audit`
- Check for high/critical vulnerabilities
- Suggest updates for vulnerable packages

### OWASP Top 10 Checklist
- [ ] A01: Broken Access Control
- [ ] A02: Cryptographic Failures
- [ ] A03: Injection
- [ ] A04: Insecure Design
- [ ] A05: Security Misconfiguration
- [ ] A06: Vulnerable Components
- [ ] A07: Auth Failures
- [ ] A08: Data Integrity Failures
- [ ] A09: Logging Failures
- [ ] A10: SSRF

## Output

Generate a security report:

```markdown
# Security Scan: <slug>

## Summary
- Files scanned: X
- Issues found: X (Y critical, Z high, W medium)
- Status: PASS / FAIL

## Critical Issues
1. **File:** `path/to/file.ts:XX`
   **Type:** Hardcoded secret
   **Risk:** API key exposed in source code
   **Fix:** Move to environment variable

## High Priority
...

## Medium Priority
...

## Dependency Audit
| Package | Current | Vulnerability | Severity | Fix |
|---------|---------|---------------|----------|-----|
| pkg-name | 1.0.0 | CVE-XXXX | High | Upgrade to 1.0.1 |

## RLS Verification
| Table | RLS Enabled | Policies | Status |
|-------|-------------|----------|--------|
| users | Yes | 3 | OK |

## Recommendations
- <security improvement suggestions>
```

## Input

Provide: feature slug

Examples:
- `/legend-security user-auth`
- `/legend-security payment-integration`
