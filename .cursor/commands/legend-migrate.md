# Generate Database Migrations

Generate and manage database migrations from a feature's design document.

## Instructions

1. Determine the feature slug from user input
2. Read `legend/features/<slug>.design.md` - stop if it doesn't exist
3. Read `legend/project.config.json` for database configuration
4. Parse the Data Model Changes section from design.md

5. Generate migration artifacts:

### SQL Migration
- Create migration file: `supabase/migrations/<timestamp>_<slug>.sql`
- Include CREATE TABLE statements
- Include CREATE INDEX statements
- Include RLS policies (ALTER TABLE, CREATE POLICY)
- Add comments explaining each section

### TypeScript Types
- Generate types from schema: `src/types/<slug>.ts`
- Use Zod for runtime validation if configured
- Export interfaces matching table structure

### Migration Tracking
- Create/update `legend/features/<slug>.migrations.md`:
  ```markdown
  # <slug> - Migrations
  
  ## Migration History
  | Version | File | Applied | Status |
  |---------|------|---------|--------|
  | 001 | 20240105_<slug>.sql | 2024-01-05 | staging |
  
  ## Pending Changes
  - <changes not yet migrated>
  
  ## Rollback Commands
  - `supabase db reset` - full reset
  - `DROP TABLE <table>` - specific rollback
  ```

6. Preview migration plan and **wait for approval**:
   ```
   Migration Plan for: <slug>
   
   Files to create:
   - supabase/migrations/<timestamp>_<slug>.sql
   - src/types/<slug>.ts
   
   SQL Preview:
   <show SQL>
   
   Apply to staging? [y/n]
   ```

7. If approved, apply to staging first:
   - Run: `supabase db push` (for local)
   - Or use Supabase MCP: `apply_migration` (for remote)

8. Update implementation.md with migration status

## Safety

- Always apply to staging/local before production
- Show full SQL before execution
- Never drop tables without explicit confirmation
- Check for existing data before destructive changes

## Rollback

If migration fails:
```bash
# Local
supabase db reset

# Remote - requires manual intervention
# Document rollback SQL in migrations.md
```

## Input

Provide: feature slug

Examples:
- `/legend-migrate user-auth`
- `/legend-migrate payment-integration`
