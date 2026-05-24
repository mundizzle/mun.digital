# design-token-distribution Specification

## Purpose
Define shared design token package distribution and task orchestration across portfolio web, docs, Storybook, and UI consumers.

## Requirements

### Requirement: Token package distribution
The system SHALL distribute generated design token CSS through `packages/tokens`.

#### Scenario: Tokens are built
- **WHEN** `pnpm design:build` is run
- **THEN** generated token CSS is written under `packages/tokens/css/` with a generated-file banner
- **AND** the CSS is generated from root `design.tokens.json`

#### Scenario: Token CSS is consumed
- **WHEN** web, docs, Storybook, or UI styles need design tokens
- **THEN** they import the package CSS entry instead of importing a web-local generated file

### Requirement: Token generation check
The system SHALL fail verification when committed package token CSS is stale.

#### Scenario: Token CSS is stale
- **WHEN** `pnpm design:check` is run and package token CSS does not match `design.tokens.json`
- **THEN** the command exits nonzero

### Requirement: Workspace orchestration
The system SHALL use explicit workspace task orchestration for shared package consumers.

#### Scenario: Shared tokens change
- **WHEN** tokens or generated token CSS change
- **THEN** web, docs, Storybook, and UI builds are invalidated by package dependencies or Turborepo task inputs

### Requirement: Token equivalence
The system SHALL expose the same semantic token values to all consumers.

#### Scenario: Consumer token smoke runs
- **WHEN** the token distribution smoke check runs
- **THEN** it verifies that the same named semantic token is available from the shared package CSS used by web, docs, and Storybook
