# Feature Status

Show the current state of features in the LEGEND pipeline with validation warnings.

## Instructions

1. List all features by scanning `legend/features/` directory
2. For each feature, determine its phase by checking which files exist:

| Files Present | Phase |
|---------------|-------|
| None | IDEA |
| `.spec.md` | SCOPED |
| `.spec.md` + `.design.md` | DESIGNED |
| `.spec.md` + `.design.md` + `.implementation.md` | IMPLEMENTED |
| `.spec.md` + `.design.md` + `.implementation.md` + `.test-report.md` | TESTED/READY |

3. Display status table:

```
LEGEND Feature Status
=====================

| Feature | Phase | Branch | Validation | Last Updated |
|---------|-------|--------|------------|--------------|
| user-auth | DESIGNED | feature/user-auth | 2 warnings | 2 days ago |
| payment | SCOPED | - | OK | 1 hour ago |
| dashboard | IMPLEMENTED | feature/dashboard | 1 blocker | 5 days ago |

Blockers:
- dashboard: 3 blocking TODOs in implementation.md

Warnings:
- user-auth: spec_hash mismatch in design.md (spec changed)
- user-auth: No security considerations documented
```

4. Run validation checks (light version of /legend-validate):
   - Check artifact hash sync (spec->design->implementation)
   - Count acceptance criteria
   - Check for blocking items
   - Verify required sections are filled

5. For detailed view (`/legend-status <slug>`):
   ```
   Feature: user-auth
   Phase: DESIGNED
   Branch: feature/user-auth
   
   Artifacts:
   - spec.md (2.1 KB, modified 3 days ago)
   - design.md (4.5 KB, modified 2 days ago)
   
   Spec Summary:
   - Problem: User authentication for the platform
   - Acceptance Criteria: 5 defined
   - Priority: P1 - High
   - Effort: M (1-3 days)
   
   Design Summary:
   - API Endpoints: 3 defined
   - Tables: 2 new
   - Security: 4/6 items checked
   
   Validation:
   [OK] Acceptance criteria format (Given/When/Then)
   [OK] Priority assigned
   [WARN] spec_hash mismatch - spec modified after design
   [WARN] 2 open blocking questions
   
   Dependencies:
   - Requires: none
   - Blocks: payment-integration
   
   Next Steps:
   - Resolve spec_hash mismatch: review spec changes
   - Run /legend-validate user-auth for full validation
   - Run /legend-build user-auth to implement
   ```

6. Highlight issues:
   - **Blockers**: Issues that prevent phase transition
   - **Warnings**: Issues that should be addressed but don't block
   - **Stale**: Features not updated in 7+ days

7. Show suggested actions based on current state

## Input

Provide: optional feature slug for detailed view

Examples:
- `/legend-status` - show all features with summary
- `/legend-status user-auth` - detailed status of user-auth
- `/legend-status --warnings` - show only features with issues

