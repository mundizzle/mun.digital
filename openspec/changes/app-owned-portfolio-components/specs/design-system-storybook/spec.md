## MODIFIED Requirements

### Requirement: Storybook app

The system SHALL provide a workspace Storybook app for app-owned portfolio components and shared token references.

#### Scenario: Storybook builds
- **WHEN** `pnpm run storybook:build` is run
- **THEN** static Storybook output is generated from stories sourced from `apps/web`

### Requirement: Component stories

Storybook SHALL document real states and props for app-owned portfolio components and templates.

#### Scenario: Section header story renders
- **WHEN** Storybook loads the section header story
- **THEN** it renders the app-owned component with representative labels and docs/controls metadata

#### Scenario: Template story renders
- **WHEN** Storybook loads a template story
- **THEN** it renders app components using fixtures rather than route `page.tsx` files

### Requirement: Token reference story

Storybook SHALL include a dedicated design token story backed by generated token metadata.

#### Scenario: Design tokens are inspected
- **WHEN** Storybook loads `Design/Tokens`
- **THEN** it renders token categories from `@mun.digital/tokens/metadata`
- **AND** component stories do not duplicate token reference tables
