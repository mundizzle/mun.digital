## ADDED Requirements

### Requirement: CLI public docs
The docs app SHALL document the public `mundigital` CLI commands.

#### Scenario: CLI docs are requested
- **WHEN** a user visits the CLI docs page
- **THEN** the page documents install/run examples, `profile`, `search`, `brief`, `links`, and `mcp` commands
- **AND** `links` commands are described as secondary public-link capabilities
- **AND** the page states that CLI output is generated from sanitized public artifacts
- **AND** any sample output uses placeholders or sanitized public artifacts only
