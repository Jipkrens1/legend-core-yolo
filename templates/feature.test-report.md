# feature-slug - Test Report

---
implementation_hash: to be filled by agent
tested: date
---

## Test matrix

Map tests to acceptance criteria:

| AC | Test file | Test name | Type | Status |
|----|-----------|-----------|------|--------|
| AC-1 | __tests__/feature.test.ts | should do X when Y | unit | PASS/FAIL |
| AC-1 | __tests__/feature.test.ts | should fail when Z | unit | PASS/FAIL |
| AC-2 | __tests__/api/route.test.ts | returns 200 on valid input | integration | PASS/FAIL |
| AC-3 | e2e/feature.spec.ts | user can complete flow | e2e | PASS/FAIL |

## Coverage report

| File | Statements | Branches | Functions | Lines |
|------|------------|----------|-----------|-------|
| All files | XX% | XX% | XX% | XX% |
| src/lib/feature.ts | XX% | XX% | XX% | XX% |
| app/api/route.ts | XX% | XX% | XX% | XX% |

**Coverage threshold:** 80%
**Status:** PASS / FAIL

## Commands run

- pnpm test -- --coverage
- pnpm test:integration
- pnpm test:e2e
- pnpm tsc --noEmit
- pnpm lint

## Results summary

| Test type | Passed | Failed | Skipped | Total |
|-----------|--------|--------|---------|-------|
| Unit | X | X | X | X |
| Integration | X | X | X | X |
| E2E | X | X | X | X |
| **Total** | **X** | **X** | **X** | **X** |

## Failures

### Test name here

**File:** path/to/test.ts
**Line:** XX

**Error:**
Expected: X
Received: Y

**Root cause:** Explanation of why this is failing

**Fix:** Proposed fix - code change or test update

**Priority:** Critical / High / Medium / Low

## Edge cases tested

- [ ] Empty input / null values
- [ ] Maximum length input
- [ ] Special characters / unicode
- [ ] Concurrent requests / race conditions
- [ ] Network timeout / offline state
- [ ] Invalid authentication / expired token
- [ ] Boundary values (0, -1, MAX_INT)
- [ ] Large data sets / pagination

## Edge cases NOT tested (gaps)

- Edge case that needs coverage
- Reason why not tested yet

## Performance notes

| Operation | Time | Acceptable | Notes |
|-----------|------|------------|-------|
| API response | Xms | under 200ms | PASS/FAIL |
| DB query | Xms | under 100ms | PASS/FAIL |
| Page load | Xs | under 3s | PASS/FAIL |

## Manual testing checklist

For QA or manual verification:

- [ ] Feature works on Chrome
- [ ] Feature works on Firefox
- [ ] Feature works on Safari
- [ ] Feature works on mobile viewport
- [ ] Feature works on tablet viewport
- [ ] Feature works with slow network (3G simulation)
- [ ] Feature is keyboard accessible
- [ ] Feature works with screen reader
- [ ] Error states display correctly
- [ ] Loading states display correctly

## Flaky tests

| Test | Flakiness | Cause | Fix status |
|------|-----------|-------|------------|
| Test name | X% | Why it is flaky | Open / Fixed |

## Recommendations

- Suggestion for improving test coverage
- Suggestion for refactoring tests
- Technical debt to address

## Sign-off

- [ ] All critical tests passing
- [ ] Coverage threshold met
- [ ] No high-priority failures
- [ ] Manual testing completed
- [ ] Ready for deployment
