# design-system Specification

## Purpose
Define the portfolio design documentation, token source of truth, generated CSS boundary, semantic Tailwind naming, color-mode behavior, typography foundation, and verification contract.
## Requirements
### Requirement: Design documentation source
The system SHALL maintain a root `DESIGN.md` that documents the portfolio design system for humans and agents.

#### Scenario: Design guidance is read
- **WHEN** an agent or maintainer needs to extend portfolio UI
- **THEN** `DESIGN.md` describes the visual intent, colors, typography, layout, depth, shapes, component guidance, and do/don't rules for the current design

### Requirement: Token source of truth
The system SHALL treat root `design.tokens.json` as the machine-readable source of truth for design token values.

#### Scenario: Token values change
- **WHEN** a maintainer changes design token values
- **THEN** they update `design.tokens.json` before updating generated CSS or component styling

### Requirement: DTCG token structure
The design token file SHALL conform to the Design Tokens Format Module 2025.10 token model used by this repository.

#### Scenario: Color tokens are declared
- **WHEN** color tokens are represented in `design.tokens.json`
- **THEN** color `$value` fields use structured OKLCH objects with `colorSpace`, `components`, and optional `alpha`, not CSS color strings

#### Scenario: Light and dark modes are declared
- **WHEN** color-mode semantics are represented
- **THEN** `semantic.light.*` and `semantic.dark.*` token groups reference same-type primitive token leaves instead of using `{ light, dark }` value wrappers

### Requirement: Generated CSS boundary
The system SHALL generate web CSS semantic token values from `design.tokens.json`.

#### Scenario: Design tokens are built
- **WHEN** `pnpm design:build` is run
- **THEN** `apps/web/src/app/tokens.generated.css` is fully regenerated from `design.tokens.json` with a generated-file banner

#### Scenario: Generated CSS is maintained
- **WHEN** a maintainer needs to change values in `apps/web/src/app/tokens.generated.css`
- **THEN** they update `design.tokens.json` and regenerate the file instead of hand-editing generated CSS

#### Scenario: Generated CSS is stale
- **WHEN** `pnpm design:check` is run and committed generated CSS does not match `design.tokens.json`
- **THEN** the command exits nonzero

#### Scenario: Generation is deterministic
- **WHEN** `pnpm design:build` is run twice without changing `design.tokens.json`
- **THEN** the generated CSS output is byte-identical

#### Scenario: Generated values preserve current design
- **WHEN** `tokens.generated.css` is built from the initial `design.tokens.json`
- **THEN** the emitted light and dark semantic values are value-equivalent to the pre-refactor values in `apps/web/src/app/globals.css`

### Requirement: Semantic Tailwind utility names
The system SHALL expose design tokens through semantic Tailwind utility names aligned with components.build conventions and documented local extensions.

#### Scenario: Components use color styling
- **WHEN** portfolio components need color, background, or border utilities
- **THEN** they use semantic token names such as `background`, `card`, `foreground`, `muted-foreground`, `subtle-foreground`, `border`, `border-strong`, `primary`, and `primary-soft` through Tailwind utility prefixes such as `bg-`, `text-`, and `border-` instead of raw color values or the legacy `ink` / `rule` / `accent` vocabulary

### Requirement: Color mode behavior
The system SHALL preserve automatic system-driven light and dark modes and existing print behavior.

#### Scenario: User system prefers dark color scheme
- **WHEN** the browser matches `prefers-color-scheme: dark`
- **THEN** generated semantic CSS custom properties provide dark-mode values without requiring a `.dark` class

#### Scenario: Portfolio is printed
- **WHEN** the portfolio is rendered for print
- **THEN** the page uses a white background, black text, and no decorative grid background

### Requirement: Typography plugin foundation
The system SHALL install and register Tailwind Typography for future rendered prose surfaces.

#### Scenario: Tailwind processes web styles
- **WHEN** the web app builds CSS
- **THEN** `@tailwindcss/typography` is available through Tailwind's CSS-first plugin registration without adding an unverified custom prose theme

### Requirement: Verification
The design system contract SHALL be protected by token generation checks, OpenSpec validation, web checks, and visual review.

#### Scenario: Design system verification runs
- **WHEN** maintainers verify design system changes
- **THEN** they run `pnpm design:build`, `pnpm design:check`, `pnpm dlx @fission-ai/openspec@latest validate establish-design-system --strict`, `pnpm run lint`, `pnpm run build`, and manually check light, dark, and print rendering
