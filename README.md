# LEGEND YOLO

**LEGEND YOLO** is the autonomous variant of LEGEND - a universal development orchestrator for Cursor that runs without approval gates.

## What is YOLO Mode?

YOLO (You Only Live Once) mode removes all confirmation and approval requirements from LEGEND. The AI will:

- Execute shell commands immediately without asking
- Deploy to production without confirmation
- Apply database migrations automatically
- Create billable resources (Supabase, Vercel) without approval
- Force push when necessary
- Run all operations autonomously

**Use at your own risk.** This mode is for developers who want maximum speed and trust their AI assistant.

## Quick Start

### 1. Set up Cursor (once per machine)

```bash
./scripts/setup-cursor-rules.sh
```

Then restart Cursor.

### 2. Connect a project to LEGEND YOLO

```bash
./scripts/connect-project.sh /path/to/your/project
```

### 3. Use LEGEND Commands

In Cursor chat, type `/` to see available commands:

| Command | Purpose |
|---------|---------|
| `/legend` | General orchestrator - routes to appropriate agent |
| `/legend-scope <slug>` | Create feature specification |
| `/legend-design <slug>` | Create architecture design |
| `/legend-build <slug>` | Implement the feature |
| `/legend-test <slug>` | Write and run tests |
| `/legend-refactor <target>` | Non-breaking improvements |
| `/legend-status` | Show feature progress |
| `/legend-setup-git` | Initialize Git repository |
| `/legend-setup-supabase` | Provision Supabase project |
| `/legend-setup-vercel` | Setup Vercel deployment |

## Key Differences from Standard LEGEND

| Aspect | Standard LEGEND | LEGEND YOLO |
|--------|-----------------|-------------|
| Shell commands | Requires approval | Auto-execute |
| Production deploys | Requires confirmation | Auto-deploy |
| DB migrations | Preview & approve | Auto-apply |
| Billable resources | Confirm before creation | Auto-create |
| Force push | Requires confirmation | Allowed |
| Review gates | Enforced | Skipped |

## Feature Pipeline

```
IDEA -> SCOPED -> DESIGNED -> IMPLEMENTED -> TESTED -> READY
```

Each phase produces artifacts in `legend/features/`:

| Phase | Artifact | Command |
|-------|----------|---------|
| SCOPED | `<slug>.spec.md` | `/legend-scope` |
| DESIGNED | `<slug>.design.md` | `/legend-design` |
| IMPLEMENTED | `<slug>.implementation.md` + code | `/legend-build` |
| TESTED | `<slug>.test-report.md` + tests | `/legend-test` |

## Example Workflow

```
/legend-scope user-auth
  -> Creates legend/features/user-auth.spec.md

/legend-design user-auth
  -> Creates legend/features/user-auth.design.md

/legend-build user-auth
  -> Implements code, creates user-auth.implementation.md
  -> Runs commands automatically, no approval needed

/legend-test user-auth
  -> Writes tests, runs them automatically
  -> Creates user-auth.test-report.md

/legend-status
  -> Shows: user-auth [TESTED]
```

## Project Structure

```
.cursor/
  .cursorrules          # Main LEGEND orchestrator (always active)
  rules/                # Sub-agent rules (.mdc files) - YOLO mode
    legend-scope.mdc
    legend-design.mdc
    legend-build.mdc
    legend-test.mdc
    legend-refactor.mdc
    legend-setup-*.mdc
  commands/             # Slash commands (/legend-*)
    legend.md
    legend-scope.md
    legend-design.md
    legend-build.md
    legend-test.md
    legend-refactor.md
    legend-status.md
    legend-setup-git.md
    legend-setup-supabase.md
    legend-setup-vercel.md
scripts/
  setup-cursor-rules.sh
  connect-project.sh
templates/
legend/
  project.config.json   # Project-specific configuration (YOLO mode enabled)
  features/             # Feature artifacts
```

## Documentation

See [legend/USAGE.md](legend/USAGE.md) for detailed documentation on:
- How commands and rules work together
- Complete workflow examples
- Configuration options
- Tips and best practices

## Warning

LEGEND YOLO provides no safety nets. It will:
- Execute destructive commands without confirmation
- Deploy untested code if you ask
- Apply breaking migrations
- Overwrite files without backup

Only use this if you:
- Have proper backups
- Understand the risks
- Trust your judgment
- Can recover from mistakes quickly
