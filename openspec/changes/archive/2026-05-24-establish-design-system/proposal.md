## Why

The portfolio UI currently has a strong visual language encoded directly in Tailwind CSS variables and component class names, but the design itself is not yet the left-most source of truth. Future UI build-out should start from a documented design system and machine-readable design tokens rather than rediscovering intent from component code.

## What Changes

- Add a root `DESIGN.md` that documents the current technical-editorial portfolio design using the DESIGN.md format.
- Add a root `design.tokens.json` that conforms to the Design Tokens Format Module 2025.10 and captures primitive and semantic tokens.
- Generate committed CSS custom properties from `design.tokens.json` into `apps/web/src/app/tokens.generated.css`.
- Add `design:build` and `design:check` scripts so generated CSS drift fails verification.
- Rename current Tailwind semantic utilities to components.build-style names extended for this site's richer foreground, border, and primary-soft levels.
- Install and register `@tailwindcss/typography` for future rendered prose surfaces without adding a custom prose theme yet.
- Add a durable `AGENTS.md` planning rule that foundation-level work starts with an OpenSpec change before implementation.

## Capabilities

### New Capabilities

- `design-system`: Defines the design documentation, token source of truth, generated CSS boundary, semantic utility naming, color-mode strategy, and verification contract for UI design work.

### Modified Capabilities

## Impact

- Adds design source files and generated CSS for the web UI.
- Updates Tailwind semantic utility names while preserving current rendered design behavior.
- Adds one web dev dependency for Tailwind Typography.
- Does not add a UI component library, a dark-mode toggle, `clsx`, `tailwind-merge`, `cn()`, a custom prose theme, or spacing/type normalization.
