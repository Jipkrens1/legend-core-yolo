# Setup Vercel

Provision a Vercel project for deployment. Part of LEGEND infrastructure setup.

## Instructions

1. Gather configuration from the user (ask once, upfront):
   - Project name (suggest based on `legend/project.config.json` name)
   - Team (use `list_teams` to show options)
   - Framework preset (infer from stack.frontend: Next.js, SvelteKit, etc.)
   - Enable AI Gateway (yes/no)
   - Environment variables to configure

2. Validate prerequisites:
   - Vercel MCP tools are available (list_projects, deploy_to_vercel, etc.)
   - User is authenticated with Vercel
   - If MCP unavailable, offer manual setup instructions

3. Preview execution plan and **wait for explicit approval**:
   ```
   Vercel Setup Plan:
   - Project: <project-name>
   - Team: <team-name>
   - Framework: <Next.js/SvelteKit/etc>
   - AI Gateway: <enabled/disabled>
   - Environment variables: <list>
   
   Steps:
   1. Create/link Vercel project
   2. Configure framework settings
   3. Enable AI Gateway (if requested)
   4. Set environment variables
   5. Deploy initial version
   ```

4. Execute using MCP tools:
   - `list_teams` to verify team access
   - `list_projects` to check for existing project
   - `deploy_to_vercel` to create and deploy
   - `get_project` to retrieve project details

5. Update `legend/project.config.json` with:
   ```json
   {
     "infrastructure": {
       "vercel": {
         "projectId": "<project-id>",
         "teamId": "<team-id>",
         "aiGateway": true
       }
     }
   }
   ```

6. If Supabase is configured, suggest adding environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Safety

- Use Vercel's encryption for sensitive environment variables
- Confirm before creating billable resources

## Fallback

If MCP tools unavailable, provide manual instructions:
1. Go to https://vercel.com/new
2. Import Git repository
3. Select team and configure framework
4. Add environment variables
5. For AI Gateway: Project Settings > AI > Enable

## Input

Example: `/legend-setup-vercel`

