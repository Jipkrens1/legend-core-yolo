# Generate Documentation

Generate or update documentation for a feature.

## Instructions

1. Determine the feature slug from user input
2. Read all feature artifacts:
   - `legend/features/<slug>.spec.md` - user stories and requirements
   - `legend/features/<slug>.design.md` - API design and data model
   - `legend/features/<slug>.implementation.md` - what was built

3. Generate documentation based on type requested:

### API Documentation
From design.md API section, generate:
- OpenAPI/Swagger spec (if applicable)
- Endpoint reference with examples
- Request/response schemas
- Error codes and handling

Output: `docs/api/<slug>.md` or update `docs/api/README.md`

### Component Documentation
For frontend features:
- Component purpose and usage
- Props/parameters documentation
- Usage examples
- Storybook story (if configured)

Output: Component JSDoc or `docs/components/<slug>.md`

### README Section
Generate a section for the project README:
- Feature overview
- How to use
- Configuration options
- Examples

Output: Suggest text for README.md

### Changelog Entry
Generate changelog entry:
```markdown
## [Unreleased]

### Added
- <feature description> (#PR-number)

### Changed
- <any changes to existing behavior>
```

Output: Suggest entry for CHANGELOG.md

### User Guide
For user-facing features:
- Step-by-step instructions
- Screenshots placeholders
- FAQ section
- Troubleshooting

Output: `docs/guides/<slug>.md`

4. Preview generated documentation and **wait for approval**
5. Create or update documentation files

## Input

Provide: feature slug and optional doc type

Examples:
- `/legend-docs user-auth` - Generate all relevant docs
- `/legend-docs user-auth api` - API documentation only
- `/legend-docs user-auth changelog` - Changelog entry only
- `/legend-docs user-auth readme` - README section
