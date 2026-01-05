# LEGEND YOLO Usage Guide

This guide explains how to use LEGEND YOLO - the autonomous execution variant of LEGEND.

## How LEGEND YOLO Works

LEGEND YOLO uses three complementary mechanisms in Cursor, modified for autonomous execution:

### 1. Commands (`.cursor/commands/*.md`)

Slash commands you explicitly invoke by typing `/` in chat:

```
/legend-scope user-auth
/legend-build user-auth
```

Commands define **what workflow to run**. They are self-documenting and discoverable.

### 2. Rules (`.cursor/rules/*.mdc`)

Rules automatically inject agent behavior based on file patterns:

| Rule | Activates When Editing |
|------|------------------------|
| `legend-scope.mdc` | `legend/features/*.spec.md` |
| `legend-design.mdc` | `legend/features/*.design.md` |
| `legend-build.mdc` | `src/**/*`, `app/**/*`, `supabase/**/*` |
| `legend-test.mdc` | `**/*.test.*`, `*.test-report.md` |

Rules define **how agents behave** when working on specific file types. In YOLO mode, all rules are configured for autonomous execution.

### 3. Orchestrator (`.cursor/.cursorrules`)

Always active. Provides:
- Project awareness (reads `legend/project.config.json`)
- Phase tracking (IDEA -> SCOPED -> DESIGNED -> etc.)
- Routing for `LEGEND:` prefix messages
- **No safety constraints** - YOLO mode executes everything immediately

## YOLO Mode Behavior

In YOLO mode, LEGEND will:

| Action | Standard LEGEND | LEGEND YOLO |
|--------|-----------------|-------------|
| Shell commands | Shows command, waits for approval | Executes immediately |
| Test execution | Proposes command, waits | Runs automatically |
| Git operations | Confirms before push | Pushes immediately |
| Force push | Requires explicit approval | Allowed |
| Database migrations | Preview and approve | Auto-apply |
| Production deploy | Requires confirmation | Auto-deploy |
| Infrastructure creation | Confirms billing | Creates automatically |

## Using Commands

### Basic Workflow

```
/legend-scope user-auth
```
Creates `legend/features/user-auth.spec.md` with:
- Problem statement
- In scope / Out of scope
- User stories
- Acceptance criteria

```
/legend-design user-auth
```
Reads the spec and creates `legend/features/user-auth.design.md` with:
- Architecture overview
- API design
- Data model changes
- Data flows

```
/legend-build user-auth
```
Reads spec + design and:
- Creates implementation checklist
- Writes code in small, focused diffs
- Updates `implementation.md` with progress
- **Runs all commands automatically**

```
/legend-test user-auth
```
Derives tests from acceptance criteria and:
- Creates unit and integration tests
- **Runs tests automatically**
- Documents results in `test-report.md`

### General Orchestrator

Use `/legend` for natural language requests:

```
/legend scope a new feature for password reset
/legend what's the status of all features?
/legend help me design the API for user-auth
```

The orchestrator routes to the appropriate agent.

### Infrastructure Setup

```
/legend-setup-git
```
- Initializes Git repository
- Creates remote on GitHub/GitLab
- Makes initial commit and push
- **No approval required**

```
/legend-setup-supabase
```
- Provisions Supabase project
- Creates staging branch
- Retrieves connection details
- **Creates billable resources automatically**

```
/legend-setup-vercel
```
- Creates Vercel project
- Configures framework settings
- Sets up environment variables
- **Creates billable resources automatically**

## Command Reference

| Command | Input | Output | Phase Transition |
|---------|-------|--------|------------------|
| `/legend` | Natural language | Routes to agent | Varies |
| `/legend-scope <slug>` | Feature slug + context | `*.spec.md` | IDEA -> SCOPED |
| `/legend-design <slug>` | Feature slug | `*.design.md` | SCOPED -> DESIGNED |
| `/legend-build <slug>` | Feature slug | Code + `*.implementation.md` | DESIGNED -> IMPLEMENTED |
| `/legend-test <slug>` | Feature slug | Tests + `*.test-report.md` | IMPLEMENTED -> TESTED |
| `/legend-refactor <target>` | File/dir/slug | Improved code | Any phase |
| `/legend-status [slug]` | Optional slug | Status table | Read-only |
| `/legend-setup-git` | - | Git repo + remote | Setup |
| `/legend-setup-supabase` | - | Supabase project | Setup |
| `/legend-setup-vercel` | - | Vercel deployment | Setup |

## Project Configuration

Each project has `legend/project.config.json`:

```json
{
  "name": "my-project",
  "stack": {
    "frontend": "next",
    "backend": "next-api",
    "database": "supabase",
    "language": "typescript"
  },
  "testing": {
    "framework": "vitest",
    "command": "pnpm test"
  },
  "constraints": {
    "prefer_small_diffs": true,
    "no_direct_prod_commands": false,
    "require_review": false,
    "require_approval": false,
    "auto_execute": true,
    "yolo_mode": true
  },
  "infrastructure": {
    "git": { "remote": "...", "provider": "github" },
    "supabase": { "projectRef": "...", "productionUrl": "..." },
    "vercel": { "projectId": "...", "teamId": "..." }
  }
}
```

LEGEND YOLO agents read this config to:
- Use the correct tech stack in designs
- Run the right test commands
- **Execute without safety constraints** (yolo_mode: true)

## Tips and Best Practices

### 1. Follow the Pipeline

Don't skip phases. Each phase builds on the previous:
- Scope before design (understand the problem first)
- Design before build (plan the architecture)
- Build before test (need code to test)

### 2. Use Meaningful Slugs

Feature slugs become file names. Use descriptive, kebab-case names:
- Good: `user-auth`, `payment-integration`, `dashboard-analytics`
- Bad: `feature1`, `new`, `fix`

### 3. Keep Specs Behavioral

Specs should describe **what** not **how**:
- Good: "Users can reset their password via email"
- Bad: "Add a /api/reset-password POST endpoint"

### 4. Trust But Verify

YOLO mode executes everything automatically. Make sure to:
- Review generated code after implementation
- Check test results in test-report.md
- Verify deployments after they complete

### 5. Check Status Regularly

```
/legend-status
```

Shows all features and their phases. Helps track progress and identify blocked items.

### 6. Use Refactor for Cleanup

After building, use `/legend-refactor` to improve code quality without changing behavior.

## Troubleshooting

### Commands Not Appearing

If `/legend-*` commands don't appear in Cursor:
1. Ensure `.cursor/commands/` exists and contains `.md` files
2. Restart Cursor
3. Commands should appear when you type `/` in chat

### Rules Not Activating

Rules activate based on file globs. If a rule isn't working:
1. Check the `globs:` pattern in the `.mdc` file
2. Ensure you're editing a matching file
3. Rules with `alwaysApply: true` are always active

### MCP Tools Unavailable

For Supabase/Vercel setup, MCP tools are required. If unavailable:
- The commands will provide manual setup instructions
- You can configure MCP in Cursor settings

## Alternative: LEGEND: Prefix

You can also use the `LEGEND:` prefix instead of commands:

```
LEGEND: scope user-auth
LEGEND: implement user-auth
LEGEND: what's the status?
```

The orchestrator in `.cursorrules` handles these. Both methods work - use whichever you prefer.

## Safety Warning

LEGEND YOLO provides **no safety nets**. It will:
- Execute destructive commands immediately
- Deploy to production without testing
- Apply breaking database migrations
- Create billable cloud resources
- Force push to protected branches

Only use YOLO mode if you:
- Have proper backup systems
- Can quickly recover from mistakes
- Understand the implications of autonomous execution
- Accept full responsibility for outcomes
