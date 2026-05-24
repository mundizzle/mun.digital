# design-system Specification Delta

## Modified Requirements

### Requirement: Generated CSS boundary
The system SHALL generate web CSS semantic token values from `design.tokens.json` through the shared token package.

#### Scenario: Design tokens are built
- **WHEN** `pnpm design:build` is run
- **THEN** `packages/tokens/css/tokens.generated.css` is fully regenerated from `design.tokens.json` with a generated-file banner

#### Scenario: Generated CSS is maintained
- **WHEN** a maintainer needs to change generated token values
- **THEN** they update `design.tokens.json` and regenerate package CSS instead of hand-editing generated CSS

### Requirement: Verification
The design system contract SHALL be protected by token generation checks, OpenSpec validation, web checks, docs checks, Storybook checks, and visual review.

#### Scenario: Design system verification runs
- **WHEN** maintainers verify public design-system changes
- **THEN** they run token, web, docs, Storybook, and relevant profile smoke checks for the changed surfaces
