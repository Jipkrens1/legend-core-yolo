# collapsible-sidebar - Spec

## Problem

The current fixed-width project sidebar consumes significant horizontal screen space, which limits the main content area especially on smaller screens or when users want to focus on project details. Users cannot expand their workspace when working on dense content like scope tables, meeting transcripts, or compliance documents.

The AI chat sidebar on the right also competes for space, leaving the main content area potentially cramped.

## In scope

- Left sidebar (project list) collapse/expand toggle
- Collapsed state shows only project icons or initials
- Expand on hover option (tooltip-style preview)
- Persistent collapse state in localStorage
- Smooth animation for collapse/expand transition
- Keyboard shortcut for quick toggle (Cmd/Ctrl + B)
- Visual indicator showing sidebar state
- Responsive behavior on mobile (auto-collapse)

## Out of scope

- Right sidebar (AI chat) collapsibility - could be separate feature
- Resizable sidebar width (drag to resize) - future enhancement
- Multiple sidebar layout presets - future enhancement
- Sidebar position customization (left/right swap) - future enhancement
- Mini-sidebar with icon-only navigation - could be part of collapsed state

## User stories

- As a user viewing project details, I want to collapse the sidebar, so that I have more space for the main content.
- As a user, I want my sidebar preference to be remembered, so that it stays collapsed/expanded as I set it.
- As a user with the sidebar collapsed, I want to hover to preview the project list, so that I can quickly navigate without fully expanding.
- As a power user, I want a keyboard shortcut to toggle the sidebar, so that I can work efficiently without using the mouse.
- As a mobile user, I want the sidebar to auto-collapse, so that I have usable screen space.

## Acceptance criteria

- [x] **AC-1**: Given the sidebar is expanded, when the user clicks the collapse button, then the sidebar collapses smoothly to a minimal width
- [x] **AC-2**: Given the sidebar is collapsed, when the user clicks the expand button, then the sidebar expands smoothly to full width
- [x] **AC-3**: Given the sidebar is collapsed, when the user hovers over it, then a temporary expanded view appears showing full project list
- [x] **AC-4**: Given the user sets a sidebar state, when they refresh or revisit the page, then the sidebar state is preserved
- [x] **AC-5**: Given the user presses Cmd/Ctrl + B, when on any page, then the sidebar toggles between collapsed and expanded
- [x] **AC-6**: Given a viewport width under 768px, when the page loads, then the sidebar is collapsed by default
- [x] **AC-7**: Given the sidebar is collapsed, when viewing the collapsed state, then project initials or icons are visible for identification
- [x] **AC-8**: Given the collapse/expand animation, when triggered, then the main content area smoothly adjusts its width

## Priority

- [x] P2 - Medium (important but not blocking)

## Effort estimate

- [x] S (2-8 hours)

## Dependencies

- **Requires:** none
- **Blocks:** none

## Success metrics

- Users can toggle sidebar state in under 1 second
- Main content area expands by at least 250px when sidebar is collapsed
- No layout shift or jank during animation
- Mobile users can access full functionality with collapsed sidebar

## Open questions

- [x] **Non-blocking:** Should the collapsed sidebar show project initials, icons, or just a thin bar? (Recommendation: initials derived from project name)
- [x] **Non-blocking:** Should hover-to-expand be optional/configurable? (Default: enabled)
