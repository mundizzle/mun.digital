## 1. OpenSpec

- [x] 1.1 Add and strictly validate the cleanup OpenSpec change.
- [x] 1.2 Validate and archive completed prior OpenSpec changes.

## 2. Homepage UI

- [x] 2.1 Update the nav brand to `mundi.morgado` with the existing blue-dot treatment.
- [x] 2.2 Refactor the hero so the rotating role sits above a shorter visual-only hero card.
- [x] 2.3 Keep the portrait inside the hero card and flush it to the top, right, and bottom edges on desktop.
- [x] 2.4 Preserve a valid homepage heading after removing visible hero title copy.
- [x] 2.5 Remove the homepage testimonial block and related dead code.

## 3. Surface Cleanup

- [x] 3.1 Replace framed card/panel borders with `border border-border/60 shadow-sm` where they act as surfaces.
- [x] 3.2 Remove Storybook and Design System rows from Agents.
- [x] 3.3 Fix the MCP Agents row to display the endpoint but link to MCP docs.

## 4. Best-Practices Review

- [x] 4.1 Review touched Next.js, React, and Tailwind/CSS surfaces against local guidance and apply low-risk cleanup.
- [x] 4.2 Document review notes in the PR.

## 5. Verification

- [x] 5.1 Run unit, lint, build, and smoke checks.
- [x] 5.2 Browser-verify changed routes at desktop and mobile widths.
- [x] 5.3 Open a PR and request Claude review.
