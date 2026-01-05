# feature-slug - Implementation

---
spec_hash: to be filled by agent
design_hash: to be filled by agent
branch: feature/slug
started: date
---

## Implementation checklist

Order tasks by dependency. Mark items as you complete them.

### Phase 1: Data layer
- [ ] 1.1 Create database migration
- [ ] 1.2 Generate TypeScript types
- [ ] 1.3 Set up RLS policies

### Phase 2: Backend
- [ ] 2.1 Create API route (depends on 1.1)
- [ ] 2.2 Add input validation
- [ ] 2.3 Add error handling

### Phase 3: Frontend
- [ ] 3.1 Create/update components (depends on 2.1)
- [ ] 3.2 Add loading states
- [ ] 3.3 Add error states
- [ ] 3.4 Connect to API

### Phase 4: Integration
- [ ] 4.1 End-to-end testing
- [ ] 4.2 Update documentation

## Requirement mapping

| Acceptance Criteria | Implementation | Files | Status |
|---------------------|----------------|-------|--------|
| AC-1 | How it is implemented | path/to/file.ts | Not started |
| AC-2 | How it is implemented | path/to/file.ts | Not started |
| AC-3 | How it is implemented | path/to/file.ts | Not started |

## Changes log

### Date
**Files created:**
- path/to/file.ts - Description of what this file does

**Files modified:**
- path/to/existing.ts - What was changed and why

**Summary:**
Brief description of changes made

## Rollback plan

If issues are discovered after deployment:

1. **Database rollback:**
   supabase db reset

2. **Code rollback:**
   git revert commit-hash

3. **Files to remove/revert:**
   - path/to/new/file.ts
   - path/to/modified/file.ts

## Pre-merge checklist

Before marking as IMPLEMENTED:

- [ ] All acceptance criteria have corresponding implementation
- [ ] TypeScript compiles without errors
- [ ] No console.log or debug statements left
- [ ] Error handling is complete
- [ ] Loading states implemented
- [ ] Responsive design checked (if applicable)
- [ ] Accessibility basics covered (if applicable)
- [ ] No hardcoded secrets or credentials
- [ ] Implementation.md updated with all changes

## TODOs and assumptions

### Blocking TODOs
- [ ] Issue that must be resolved before testing

### Non-blocking TODOs
- [ ] Improvement that can be done later

### Assumptions made
- Assumption about requirements or design
- Assumption about existing code or dependencies

## Notes

Any additional context, decisions made during implementation, or gotchas for future developers
