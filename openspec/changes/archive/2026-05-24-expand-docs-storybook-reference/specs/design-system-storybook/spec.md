## ADDED Requirements

### Requirement: Token reference
Storybook SHALL expose generated design tokens through metadata-rendered docs.

#### Scenario: Storybook component docs are opened
- **WHEN** Storybook loads the design-system stories
- **THEN** token reference docs are rendered from `@mun.digital/tokens/metadata`
- **AND** token reference docs do not depend on a color parser that rejects OKLCH values

### Requirement: Branded Storybook theme
Storybook SHALL apply a mun.digital theme to manager chrome and Docs.

#### Scenario: Storybook renders manager and docs surfaces
- **WHEN** Storybook is opened locally or as a static build
- **THEN** manager chrome uses mun.digital theme colors and monospace-forward chrome typography
- **AND** Docs content uses the same theme with readable sans text where appropriate

### Requirement: Storybook component test path
Storybook SHALL use the Storybook Vitest addon as the primary automated component and interaction test path for the current slice.

#### Scenario: Storybook tests run
- **WHEN** the Storybook component test script runs against the current slice
- **THEN** it exercises the documented `SectionHeader` stories through Storybook
- **AND** failures are reported through the Storybook Vitest path

## MODIFIED Requirements

### Requirement: Component stories
Storybook SHALL document real states and props for the vertical slice.

#### Scenario: Section header story renders
- **WHEN** Storybook loads the section header story
- **THEN** it renders the shared component with representative labels and docs/controls metadata
- **AND** primitive props have useful controls
- **AND** `ReactNode` and class-name props are disabled or constrained when free editing would be noisy

### Requirement: Accessibility posture
Storybook SHALL include accessibility checks for the established vertical slice.

#### Scenario: Storybook accessibility verification runs
- **WHEN** `pnpm run storybook:a11y` is run
- **THEN** the current checked `SectionHeader` story path is tested with hard-error accessibility failures
- **AND** the command exits nonzero when an accessibility violation is detected

### Requirement: Local MCP only
Storybook MCP SHALL be available only for local development workflows.

#### Scenario: Static Storybook is deployed
- **WHEN** static Storybook is served publicly
- **THEN** it does not expose or imply a live MCP endpoint

#### Scenario: Local Storybook is used by agents
- **WHEN** agents need Storybook MCP during local development
- **THEN** they use `@storybook/addon-mcp` only against a local Storybook instance
