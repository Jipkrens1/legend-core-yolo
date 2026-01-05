# Create Feature Branch

Create or switch to a feature branch for implementation.

## Instructions

1. Determine the feature slug from user input
2. Read `legend/project.config.json` for git configuration:
   - Branch prefix (default: "feature/")
   - Require PR setting
3. Check if feature artifacts exist:
   - At minimum, `.spec.md` should exist
   - Warn if starting implementation without design

4. Generate branch name: `<prefix><slug>`
   - Example: `feature/user-auth`

5. Check current git status:
   - Warn if there are uncommitted changes
   - Show current branch

6. Preview and **wait for approval**:
   ```
   Branch Setup Plan:
   - Feature: <slug>
   - Branch name: feature/<slug>
   - Base branch: main
   - Current status: <clean/dirty>
   
   Commands:
   1. git checkout main
   2. git pull origin main
   3. git checkout -b feature/<slug>
   ```

7. Execute commands one by one

8. Update `legend/features/<slug>.implementation.md`:
   - Add branch name to header metadata
   ```markdown
   ---
   branch: feature/<slug>
   created: <date>
   ---
   ```

9. Suggest next steps:
   - Start implementation: `/legend-build <slug>`
   - Check status: `/legend-status <slug>`

## Switching to Existing Branch

If the branch already exists:
1. Offer to switch to it
2. Show branch status (ahead/behind main)
3. Suggest pulling latest changes

## Cleanup

When feature is complete:
```bash
# After merge to main
git checkout main
git pull
git branch -d feature/<slug>
```

## Input

Provide: feature slug

Examples:
- `/legend-branch user-auth` - Create/switch to feature/user-auth
- `/legend-branch payment-integration`
