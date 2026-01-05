# Test a Feature

Write and run tests for an implemented feature. This is the fourth phase of the LEGEND pipeline.

## Instructions

1. Determine the feature slug from user input
2. Read the feature's documentation:
   - `legend/features/<slug>.spec.md` - acceptance criteria to test against
   - `legend/features/<slug>.design.md` - API contracts and data models
   - `legend/features/<slug>.implementation.md` - what was built
3. Read `legend/project.config.json` for testing setup (framework, commands)
4. Derive concrete test cases:
   - Unit tests for individual functions/components
   - Integration tests for API endpoints
   - E2E tests if appropriate for the stack
5. If tests are missing:
   - Propose file locations and names that fit project conventions
   - Create or update test files
6. Propose a test command (e.g., `npm test`, `pnpm test -- <pattern>`) and **wait for approval**
7. After running tests, create/update `legend/features/<slug>.test-report.md` with:
   - Commands run
   - Pass/fail summary
   - Coverage gaps or flaky areas
8. For failures: explain clearly and propose minimal fixes

## Phase Transition

- **Input**: IMPLEMENTED (code exists)
- **Output**: TESTED (tests + test-report.md)
- **Next**: Feature is READY for review/deployment

## Input

Provide: feature slug

Examples:
- `/legend-test user-auth`
- `/legend-test payment-integration`

