# Setup Supabase

Provision a Supabase project with staging environment. Part of LEGEND infrastructure setup.

## Instructions

1. Gather configuration from the user (ask once, upfront):
   - Project name (suggest based on `legend/project.config.json` name)
   - Organization (if multiple available)
   - Staging branch name (default: "staging")
   - Whether to create initial migrations

2. Validate prerequisites:
   - Supabase MCP tools are available (list_tables, create_branch, etc.)
   - User has appropriate permissions
   - If MCP unavailable, offer manual setup instructions

3. Preview execution plan and **wait for explicit approval**:
   ```
   Supabase Setup Plan:
   - Production project: <project-name>
   - Staging branch: staging
   - Initial tables: <yes/no>
   
   Steps:
   1. Create/connect production project
   2. Create staging branch
   3. Apply initial migrations (if requested)
   4. Retrieve project URL and keys
   ```

4. Execute using MCP tools:
   - `list_tables` to verify connection
   - `create_branch` for staging environment
   - `apply_migration` for initial schema
   - `get_project_url` and `get_publishable_keys` for credentials

5. Update `legend/project.config.json` with:
   ```json
   {
     "infrastructure": {
       "supabase": {
         "projectRef": "<project-ref>",
         "stagingBranchId": "<branch-id>",
         "productionUrl": "<url>"
       }
     }
   }
   ```

6. Display the project URL and publishable keys for the user to save

## Safety

- Never store secret keys in config files (only public/anon keys)
- Confirm before creating billable resources

## Fallback

If MCP tools unavailable, provide manual instructions:
1. Go to https://supabase.com/dashboard
2. Create new project
3. Navigate to Branches, create staging
4. Copy project ref to config

## Input

Example: `/legend-setup-supabase`

