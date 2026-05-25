## MODIFIED Requirements

### Requirement: Docs app
The system SHALL provide a workspace docs app for public reference documentation.

#### Scenario: Docs build
- **WHEN** `pnpm run docs:build` is run
- **THEN** the docs app builds successfully

### Requirement: Design-system content
The docs app SHALL document reusable UI components, token usage, CLI usage, MCP usage, Storybook workflow, and agentic design-system workflow.

#### Scenario: Docs homepage is requested
- **WHEN** a user visits the docs app
- **THEN** it presents public reference documentation rather than profile/resume content
- **AND** it prioritizes components, tokens, CLI, MCP, Storybook, and agent workflow

#### Scenario: Public links are documented
- **WHEN** the docs describe CLI or MCP public link capabilities
- **THEN** Raindrop-backed link behavior is presented as a secondary public-links capability rather than a primary docs section

#### Scenario: CLI and MCP examples are public-safe
- **WHEN** docs include sample CLI or MCP output
- **THEN** examples are placeholders or are drawn only from sanitized public artifacts
- **AND** they do not expose `basics.phone`, `basics.location.address`, `basics.location.postalCode`, `meta.private.*`, or non-public email fields

### Requirement: Markdown page routes
The docs app SHALL expose Markdown-oriented page routes for docs pages.

#### Scenario: A page Markdown route is requested
- **WHEN** a client requests a documented page with a `.md` suffix
- **THEN** the response returns Markdown for that public reference page

### Requirement: Docs LLM outputs
The docs app SHALL expose docs-only `llms.txt` and `llms-full.txt` outputs.

#### Scenario: Docs LLM routes are requested
- **WHEN** `/llms.txt` or `/llms-full.txt` is requested from the docs app
- **THEN** the response contains public reference documentation only
- **AND** it clearly cross-links to the separate profile/resume LLM surface on `mun.digital`
- **AND** it includes CLI and MCP docs content without exposing private profile data

#### Scenario: Docs smoke guards public reference coverage
- **WHEN** `pnpm run docs:llms:smoke` is run
- **THEN** the smoke check verifies that CLI docs enumerate `profile`, `search`, `brief`, `links`, and `mcp`
- **AND** it verifies that MCP docs enumerate the public `resume` resource, `search`, `brief`, `links_search`, `links_fetch`, and `fetch` tools, and the `portfolio_brief` prompt
