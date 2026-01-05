# Refactor Code

Make non-breaking improvements to existing code. Can be used at any phase.

## Instructions

1. Identify the target from user input (file, directory, or feature slug)
2. If a feature slug is provided, read its implementation.md to understand what was built
3. Apply improvements while following these rules:
   - **Do NOT change observable behavior** - all existing tests must pass
   - Focus on:
     - Readability improvements
     - Reducing code duplication (DRY)
     - Improving naming clarity
     - Small, obvious performance wins
     - Removing dead code
4. Summarize changes in the feature's `implementation.md` or a short note if generic refactoring
5. If you detect an actual bug during refactoring:
   - Document it clearly
   - Ask before making any behavior-changing edits

## Safety

- Run tests before and after refactoring to ensure no regressions
- Make small, incremental changes rather than large rewrites
- If uncertain about a change, ask first

## Input

Provide: what to refactor (file path, directory, or feature slug)

Examples:
- `/legend-refactor src/lib/auth.ts`
- `/legend-refactor src/components/`
- `/legend-refactor user-auth` - refactor code related to user-auth feature

