# Validate Feature Phase

Validate that a feature meets the requirements to transition to the next phase.

## Instructions

1. Determine the feature slug from user input
2. Scan `legend/features/` to find all artifacts for this feature
3. Determine current phase based on existing files:
   - Only `.spec.md` exists: SCOPED
   - `.spec.md` + `.design.md`: DESIGNED
   - `.spec.md` + `.design.md` + `.implementation.md`: IMPLEMENTED
   - All four files: TESTED

4. Run validation checks for current phase:

### SCOPED Phase Validation
- [ ] At least 3 acceptance criteria defined
- [ ] All acceptance criteria use Given/When/Then format
- [ ] Priority is selected (P0-P3)
- [ ] Effort estimate is selected
- [ ] No blocking open questions remain unanswered
- [ ] Problem statement is filled in
- [ ] At least one user story defined

### DESIGNED Phase Validation
- [ ] All acceptance criteria from spec are addressable in design
- [ ] API design section has at least one endpoint defined
- [ ] Data model section is complete (or marked N/A)
- [ ] Security considerations checklist is filled
- [ ] Error handling table has entries
- [ ] Sequence diagram exists for happy path
- [ ] spec_hash matches current spec (no out-of-sync)

### IMPLEMENTED Phase Validation
- [ ] All checklist items are marked complete
- [ ] Requirement mapping table has all ACs mapped to files
- [ ] design_hash matches current design (no out-of-sync)
- [ ] Pre-merge checklist items are checked
- [ ] No blocking TODOs remain
- [ ] Rollback plan is documented
- [ ] Changes log has at least one entry

### TESTED Phase Validation
- [ ] Test matrix covers all acceptance criteria
- [ ] Coverage threshold met (check project.config.json)
- [ ] No critical/high priority failures
- [ ] implementation_hash matches (no out-of-sync)
- [ ] Sign-off checklist complete

5. Output validation report:
   ```
   Feature: <slug>
   Current Phase: <phase>
   Next Phase: <next-phase>
   
   Validation Results:
   [PASS] Check 1
   [PASS] Check 2
   [FAIL] Check 3 - <reason>
   [WARN] Check 4 - <suggestion>
   
   Status: READY / NOT READY for <next-phase>
   
   Issues to resolve:
   1. <issue>
   2. <issue>
   ```

6. If all checks pass, confirm ready for next phase
7. If checks fail, list specific items to fix

## Safety

- This is a read-only validation, no files are modified
- Warn if artifacts appear out of sync (hash mismatch)

## Input

Provide: feature slug

Examples:
- `/legend-validate user-auth`
- `/legend-validate payment-integration`
