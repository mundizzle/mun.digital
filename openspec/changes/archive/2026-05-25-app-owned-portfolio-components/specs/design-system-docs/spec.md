## MODIFIED Requirements

### Requirement: Docs app

The system SHALL provide a workspace docs app focused on public agentic interfaces.

#### Scenario: Docs build
- **WHEN** `pnpm run docs:build` is run
- **THEN** the docs app builds successfully

### Requirement: Agentic content emphasis

The docs app SHALL emphasize MCP and CLI as the primary public reference surfaces.

#### Scenario: Docs homepage is requested
- **WHEN** a user visits the docs app
- **THEN** it presents MCP and CLI documentation before supporting architecture, workflow, component, token, and Storybook references

### Requirement: Supporting design references

The docs app SHALL preserve design/component/token/Storybook URLs as supporting references.

#### Scenario: Supporting docs routes are requested
- **WHEN** a client requests `/components`, `/tokens`, `/storybook`, or their `.md` routes
- **THEN** the response remains available
- **AND** the content points readers to Storybook and tokens without positioning a UI package as a primary surface

### Requirement: Docs LLM outputs

The docs app SHALL expose `llms.txt` and `llms-full.txt` outputs centered on MCP and CLI.

#### Scenario: Docs LLM routes are requested
- **WHEN** `/llms.txt` or `/llms-full.txt` is requested from the docs app
- **THEN** the response prioritizes MCP and CLI documentation
- **AND** it clearly cross-links to the separate profile/resume LLM surface on `mun.digital`
