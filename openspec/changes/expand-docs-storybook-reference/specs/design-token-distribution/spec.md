## ADDED Requirements

### Requirement: Token metadata export
The system SHALL generate static token metadata from root `design.tokens.json` and expose it through `@mun.digital/tokens/metadata`.

#### Scenario: Tokens are built with metadata
- **WHEN** `pnpm design:build` is run
- **THEN** generated token metadata is written under `packages/tokens/metadata/`
- **AND** the metadata is generated from root `design.tokens.json`
- **AND** `@mun.digital/tokens/metadata` resolves to the generated metadata module

#### Scenario: Token metadata is stale
- **WHEN** `pnpm design:check` is run and package token metadata does not match `design.tokens.json`
- **THEN** the command exits nonzero

### Requirement: Token documentation annotations
The system SHALL annotate generated token CSS with token documentation comments for future Storybook addon compatibility.

#### Scenario: Generated CSS is inspected
- **WHEN** `packages/tokens/css/tokens.generated.css` is inspected
- **THEN** semantic token variables expose `@tokens` and `@presenter` comments for meaningful token categories such as `Colors` and `Layout`

## MODIFIED Requirements

### Requirement: Token package distribution
The system SHALL distribute generated design token CSS and metadata through `packages/tokens`.

#### Scenario: Tokens are built
- **WHEN** `pnpm design:build` is run
- **THEN** generated token CSS is written under `packages/tokens/css/` with a generated-file banner
- **AND** generated token metadata is written under `packages/tokens/metadata/` with a generated-file banner
- **AND** both outputs are generated from root `design.tokens.json`

#### Scenario: Token CSS is consumed
- **WHEN** web, docs, Storybook, or UI styles need design tokens
- **THEN** they import the package CSS entry instead of importing a web-local generated file

### Requirement: Token generation check
The system SHALL fail verification when committed package token CSS or metadata is stale.

#### Scenario: Token outputs are stale
- **WHEN** `pnpm design:check` is run and package token CSS or metadata does not match `design.tokens.json`
- **THEN** the command exits nonzero

### Requirement: Token equivalence
The system SHALL expose the same semantic token values to all consumers.

#### Scenario: Consumer token smoke runs
- **WHEN** the token distribution smoke check runs
- **THEN** it verifies that the same named semantic token is available from the shared package CSS used by web, docs, and Storybook
- **AND** it verifies that generated metadata exposes matching semantic token entries
