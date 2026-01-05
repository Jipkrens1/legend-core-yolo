# Deploy Feature

Deploy a feature to preview or production environment.

## Instructions

1. Determine the feature slug and environment from user input
   - Preview: Deploy to preview URL for testing
   - Production: Deploy to production (requires approval)

2. Validate prerequisites:
   - Feature is in TESTED phase (test-report.md exists)
   - All tests passing
   - No critical security issues (run `/legend-security` if not done)

3. Read `legend/project.config.json` for deployment configuration:
   - Vercel project info
   - Environment variables needed

4. For Preview Deployment:
   ```
   Preview Deployment Plan:
   - Feature: <slug>
   - Branch: feature/<slug>
   - Target: Vercel Preview
   - URL: Will be generated
   
   Steps:
   1. Push current branch to remote
   2. Vercel auto-deploys preview
   3. Retrieve preview URL
   ```

5. For Production Deployment:
   ```
   Production Deployment Plan:
   - Feature: <slug>
   - Source: main branch (after PR merge)
   - Target: Vercel Production
   
   Pre-deploy checklist:
   - [ ] All tests passing
   - [ ] Security scan clean
   - [ ] PR approved and merged
   - [ ] Database migrations applied
   
   Steps:
   1. Merge PR to main (if not done)
   2. Vercel auto-deploys production
   3. Verify deployment health
   4. Monitor for errors
   ```

6. **Wait for explicit approval** before any production deployment

7. Post-deployment:
   - Verify deployment succeeded
   - Check health endpoint
   - Monitor error rates for 15 minutes
   - Update implementation.md with deployment status

## Rollback

If issues are discovered:
```bash
# Via Vercel CLI
vercel rollback

# Via Vercel Dashboard
# Go to Deployments > Select previous > Promote to Production

# Database rollback if needed
# See legend/features/<slug>.migrations.md
```

## Input

Provide: feature slug and environment

Examples:
- `/legend-deploy user-auth preview`
- `/legend-deploy user-auth production`
- `/legend-deploy payment-integration preview`
