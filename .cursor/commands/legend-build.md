# Build a Feature

Implement a feature based on its spec and design. This is the third phase of the LEGEND pipeline.

## Instructions

1. Determine the feature slug from user input
2. Read `legend/features/<slug>.spec.md` and `<slug>.design.md`
   - If spec is missing, stop and suggest `/legend-scope` first
   - If design is missing, ask whether to proceed with spec only or design first
3. Read `legend/project.config.json` for stack and constraints

4. **Branch Setup** (if git.branchPrefix is configured):
   - Check if feature branch exists: `feature/<slug>`
   - If not, suggest running `/legend-branch <slug>` first
   - If branch exists, verify you are on it

5. **Artifact Versioning**:
   - Compute hashes of spec.md and design.md content
   - Add to implementation.md frontmatter:
     ```yaml
     ---
     spec_hash: <hash>
     design_hash: <hash>
     branch: feature/<slug>
     started: <date>
     ---
     ```

6. Create `legend/features/<slug>.implementation.md` with:
   - Phased checklist of implementation steps (ordered by dependency)
   - Mapping from acceptance criteria to implementation files
   - Rollback plan

7. Apply changes in small, focused diffs:
   - Reuse existing patterns and abstractions from the project
   - Follow the project's coding conventions
   - Complete one phase before starting the next

8. After each logical chunk, update `implementation.md` with:
   - Files touched
   - Summary of changes
   - Remaining TODOs and assumptions

9. Before marking complete, verify:
   - All acceptance criteria mapped to files
   - Pre-merge checklist items checked
   - No blocking TODOs remain

## Safety

- Never run shell commands without showing them first and getting explicit approval
- Prefer small, composable edits over giant refactors
- Respect the project's `no_direct_prod_commands` constraint if set
- If spec or design hash changed since last session, warn about sync issues

## Phase Transition

- **Input**: DESIGNED (design.md exists)
- **Output**: IMPLEMENTED (code + implementation.md)
- **Next**: `/legend-test <slug>` to verify

## Input

Provide: feature slug

Examples:
- `/legend-build user-auth`
- `/legend-build payment-integration`

