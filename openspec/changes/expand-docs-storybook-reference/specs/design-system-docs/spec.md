## ADDED Requirements

### Requirement: Reference-quality docs rendering
The docs app SHALL render design-system reference pages through a vetted Markdown renderer as readable pages rather than raw MDX text.

#### Scenario: Docs page is requested
- **WHEN** a user visits a design-system docs route
- **THEN** headings, paragraphs, lists, links, code examples, tables, and inline code render as page UI
- **AND** the raw Markdown source remains available from the page action

### Requirement: Static-safe docs routes and metadata
The docs app SHALL keep documentation routes and metadata static-safe and indexable.

#### Scenario: Docs build prerenders routes
- **WHEN** `pnpm run docs:build` is run
- **THEN** docs pages and Markdown/LLM route handlers avoid request-time APIs
- **AND** canonical metadata points to the matching docs page without deindexing subpages

## MODIFIED Requirements

### Requirement: Design-system content
The docs app SHALL document the token model, generated token reference, shared UI usage, architecture, Storybook workflow, and agentic design-system workflow.

#### Scenario: Docs homepage is requested
- **WHEN** a user visits the docs app
- **THEN** it presents design-system documentation rather than profile/resume content

#### Scenario: Design-system reference pages are requested
- **WHEN** a user visits token, shared UI, Storybook, or agent workflow docs
- **THEN** the docs describe semantic token usage, generated token reference, `SectionHeader` API/examples, Storybook Docs/Controls/token addon/testing/a11y/local MCP workflow, and OpenSpec/Claude review/verification workflow

### Requirement: Docs LLM outputs
The docs app SHALL expose docs-only `llms.txt` and `llms-full.txt` outputs.

#### Scenario: Docs LLM routes are requested
- **WHEN** `/llms.txt` or `/llms-full.txt` is requested from the docs app
- **THEN** the response contains design-system documentation only
- **AND** it clearly cross-links to the separate profile/resume LLM surface on `mun.digital`
- **AND** generated token reference content does not expose profile/resume private data
