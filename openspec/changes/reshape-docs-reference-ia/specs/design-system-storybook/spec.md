## MODIFIED Requirements

### Requirement: Component stories
Storybook SHALL document real states and props for reusable components in `packages/ui`.

#### Scenario: Section header story renders
- **WHEN** Storybook loads the section header story
- **THEN** it renders the shared component with representative labels and docs/controls metadata

#### Scenario: Storybook is used as component catalog
- **WHEN** a reviewer opens Storybook
- **THEN** it presents `packages/ui` components as the interactive design-system catalog
- **AND** it describes high-level site assembly through components, tokens, examples, controls, tests, and accessibility evidence
- **AND** it does not try to serve as the CLI or MCP manual
