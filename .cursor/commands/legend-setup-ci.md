# Setup CI/CD

Configure continuous integration and deployment pipelines.

## Instructions

1. Read `legend/project.config.json` for:
   - Stack configuration (frontend, backend, language)
   - Testing setup (unit, e2e frameworks)
   - Git provider (github, gitlab)
   - Deploy target (vercel, etc.)

2. Gather configuration from user (ask once):
   - CI provider: GitHub Actions or GitLab CI
   - Environments: staging, production
   - Auto-deploy on merge? (yes/no)
   - Required checks before merge

3. Generate appropriate configuration:

### GitHub Actions

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test -- --coverage

  build:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

### GitLab CI

Create `.gitlab-ci.yml`:
```yaml
stages:
  - lint
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "20"

.node_setup:
  image: node:${NODE_VERSION}
  cache:
    paths:
      - node_modules/
      - .pnpm-store/
  before_script:
    - corepack enable
    - pnpm install --frozen-lockfile

lint:
  extends: .node_setup
  stage: lint
  script:
    - pnpm lint
    - pnpm tsc --noEmit

test:
  extends: .node_setup
  stage: test
  script:
    - pnpm test -- --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

build:
  extends: .node_setup
  stage: build
  script:
    - pnpm build
  artifacts:
    paths:
      - .next/
    expire_in: 1 hour
```

4. Preview configuration and **wait for approval**

5. Create the workflow file

6. Update `legend/project.config.json`:
   ```json
   {
     "infrastructure": {
       "ci": {
         "provider": "github-actions",
         "workflowFile": ".github/workflows/ci.yml"
       }
     }
   }
   ```

7. Suggest next steps:
   - Set up branch protection rules
   - Configure required status checks
   - Add deployment workflow

## Input

Example: `/legend-setup-ci`
