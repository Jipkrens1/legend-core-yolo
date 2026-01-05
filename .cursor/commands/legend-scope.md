# Scope a Feature

Create or refine a feature specification. This is the first phase of the LEGEND pipeline.

## Instructions

1. Determine the feature slug from user input
2. Create `legend/features/<slug>.spec.md` if it doesn't exist
3. Read `legend/project.config.json` for stack context and constraints
4. Structure the spec with these sections:
   - **Problem** - What problem does this feature solve?
   - **In Scope** - What will be built
   - **Out of Scope** - What will NOT be built (important boundaries)
   - **User Stories** - As a [user], I want [goal], so that [benefit]
   - **Acceptance Criteria** - Concrete, testable conditions for done
   - **Open Questions** - Uncertainties that need resolution
5. Keep it behavioral - no implementation details
6. Only ask the user for information that is critical and cannot be reasonably assumed

## Phase Transition

- **Input**: IDEA (just a feature name/concept)
- **Output**: SCOPED (complete spec.md)
- **Next**: `/legend-design <slug>` to create architecture

## Input

Provide: feature slug and any initial context

Examples:
- `/legend-scope user-auth`
- `/legend-scope user-auth users can login with email and password, need password reset`
- `/legend-scope payment-integration we use Stripe`

