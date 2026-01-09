# dark-mode - Spec

## Problem

Compass currently only supports a light theme, which causes eye strain for users working in low-light environments or during extended sessions. Modern applications are expected to provide dark mode as a standard accessibility and comfort feature. Users cannot customize the visual appearance to match their system preferences or personal comfort.

## In scope

- Dark color theme with proper contrast ratios (WCAG AA compliant)
- Theme toggle button in the header
- System preference detection (prefers-color-scheme)
- Theme persistence in localStorage
- Smooth transition animation between themes
- All UI components updated for both themes (shadcn/ui, custom components)
- Charts and graphs (Recharts) themed appropriately
- Proper dark mode colors for all states (hover, active, disabled, focus)

## Out of scope

- Multiple custom themes beyond light/dark - future enhancement
- Per-user theme preference stored in database - future enhancement
- High contrast mode for accessibility - separate feature
- Theme scheduling (auto-switch by time of day) - future enhancement
- Custom accent color selection - future enhancement

## User stories

- As a user working at night, I want to switch to dark mode, so that I can reduce eye strain.
- As a user, I want the app to respect my system dark mode preference, so that it matches my other applications.
- As a user, I want my theme preference to be remembered, so that I don't have to set it every time.
- As a user, I want a visible toggle to switch themes, so that I can easily change modes.

## Acceptance criteria

- [x] **AC-1**: Given a user, when they click the theme toggle, then the entire UI switches between light and dark mode
- [x] **AC-2**: Given a user with system dark mode enabled, when they first visit the app (no stored preference), then dark mode is automatically applied
- [x] **AC-3**: Given a user who selected a theme, when they close and reopen the browser, then their selected theme is preserved
- [x] **AC-4**: Given dark mode is active, when viewing any page, then all text has sufficient contrast (4.5:1 ratio minimum)
- [x] **AC-5**: Given the theme toggle, when visible in the header, then it shows an appropriate icon (sun/moon) indicating current state
- [x] **AC-6**: Given a theme change, when triggered, then the transition is smooth (CSS transition, no flash of wrong theme)
- [x] **AC-7**: Given Recharts graphs, when in dark mode, then axis labels, legends, and tooltips are readable
- [x] **AC-8**: Given form inputs and buttons, when in dark mode, then all states (hover, focus, disabled) are visually distinct

## Priority

- [x] P1 - High (core functionality)

## Effort estimate

- [x] S (2-8 hours)

## Dependencies

- **Requires:** none (TailwindCSS dark mode support already available)
- **Blocks:** none

## Success metrics

- Theme toggle is discoverable (< 3 seconds to find)
- No accessibility contrast failures in dark mode
- No "flash of unstyled content" or wrong theme on page load
- User preference persists across sessions

## Open questions

- [x] **Non-blocking:** Should we use class-based or media-query-based dark mode? (Recommendation: class-based for manual override capability)
