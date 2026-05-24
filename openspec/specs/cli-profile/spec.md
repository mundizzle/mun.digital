# cli-profile Specification

## Purpose
TBD - created by archiving change backfill-current-system-specs. Update Purpose after archive.
## Requirements
### Requirement: CLI profile command
The system SHALL provide a `mundigital profile` command that prints the sanitized public profile.

#### Scenario: Text profile is requested
- **WHEN** `mundigital profile` is run without `--json`
- **THEN** the CLI prints a readable public profile summary, profile links, and skills

#### Scenario: JSON profile is requested
- **WHEN** `mundigital profile --json` or `mundigital --json` is run
- **THEN** the CLI prints sanitized public resume JSON

### Requirement: CLI search command
The system SHALL provide a `mundigital search <query>` command for public resume evidence.

#### Scenario: Search query is provided
- **WHEN** `mundigital search <query>` is run
- **THEN** the CLI returns public resume evidence matching the query in text or JSON form

#### Scenario: Search query is missing
- **WHEN** `mundigital search` is run without a non-empty query
- **THEN** the CLI exits with usage guidance instead of returning unrelated data

### Requirement: CLI brief command
The system SHALL provide a `mundigital brief` command that emits an agent-ready public career brief.

#### Scenario: Brief is requested
- **WHEN** `mundigital brief` is run
- **THEN** the CLI prints a public brief derived from sanitized resume content

### Requirement: CLI links commands
The system SHALL provide `mundigital links`, `mundigital links search <query>`, and `mundigital links fetch <id>` commands for curated public links.

#### Scenario: Links are listed
- **WHEN** `mundigital links` is run
- **THEN** the CLI prints the sanitized public Raindrop snapshot or a clear empty-state message

#### Scenario: Link search is requested
- **WHEN** `mundigital links search <query>` is run
- **THEN** the CLI returns matching sanitized public links in text or JSON form

#### Scenario: Link fetch is requested
- **WHEN** `mundigital links fetch <id>` is run
- **THEN** the CLI returns the sanitized public link with that id or exits with a clear not-found error

### Requirement: CLI MCP command
The system SHALL provide a `mundigital mcp` command that starts the local stdio MCP server.

#### Scenario: MCP command is run
- **WHEN** `mundigital mcp` is run by an MCP client
- **THEN** the CLI starts the read-only `mundigital` stdio MCP server

### Requirement: Verification
The CLI profile contract SHALL be protected by profile and package smoke checks.

#### Scenario: CLI verification runs
- **WHEN** maintainers verify CLI behavior
- **THEN** they run `pnpm run profile:smoke` and `pnpm run pack:smoke`

