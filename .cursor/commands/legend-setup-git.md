# Setup Git Repository

Initialize Git and create a remote repository. Part of LEGEND infrastructure setup.

## Instructions

1. Gather configuration from the user (ask once, upfront):
   - Repository name (suggest based on `legend/project.config.json` name)
   - Visibility: public or private
   - Remote provider: GitHub, GitLab, or Bitbucket
   - Default branch name (default: "main")
   - Description (optional)

2. Validate prerequisites:
   - Git is installed (`git --version`)
   - CLI tool is authenticated:
     - GitHub: `gh auth status`
     - GitLab: `glab auth status`
   - Check if already a git repo (`git rev-parse --is-inside-work-tree`)
   - Check for existing remotes (`git remote -v`)

3. Preview execution plan and **wait for explicit approval**:
   ```
   Git Setup Plan:
   - Repository: <repo-name>
   - Provider: <github/gitlab>
   - Visibility: <public/private>
   - Default branch: main
   
   Commands to execute:
   1. git init (if needed)
   2. git branch -M main
   3. gh repo create <repo-name> --<visibility> --source=. --remote=origin
   4. git add . && git commit -m "Initial commit"
   5. git push -u origin main
   ```

4. Execute commands one by one, showing each before running

5. Update `legend/project.config.json` with git remote info

6. Suggest next steps:
   - Branch protection rules
   - CI/CD setup
   - Connect to Vercel (`/legend-setup-vercel`)

## Safety

- Check for sensitive files (.env, secrets) before first commit
- Never force push without explicit confirmation
- Show every command before running

## Input

Example: `/legend-setup-git`

