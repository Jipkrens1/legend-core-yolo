# Design a Feature

Create architecture and API design for a scoped feature. This is the second phase of the LEGEND pipeline.

## Instructions

1. Determine the feature slug from user input
2. Read `legend/features/<slug>.spec.md` - **stop if it doesn't exist** and suggest running `/legend-scope` first
3. Read `legend/project.config.json` for stack constraints (frontend, backend, database, etc.)
4. Create `legend/features/<slug>.design.md` with these sections:
   - **Architecture Overview** - High-level component diagram and responsibilities
   - **API Design** - Routes/functions, request/response payloads, error handling
   - **Data Model Changes** - Database tables, columns, indexes, RLS policies
   - **Data Flows** - How data moves between frontend, backend, DB, and external services
   - **Risks and Tradeoffs** - Known limitations, alternatives considered
5. No actual code - keep it at the design level but be concrete
6. Prefer simple, composable designs aligned with existing project patterns

## Phase Transition

- **Input**: SCOPED (spec.md exists)
- **Output**: DESIGNED (design.md complete)
- **Next**: `/legend-build <slug>` to implement

## Input

Provide: feature slug

Examples:
- `/legend-design user-auth`
- `/legend-design payment-integration`

