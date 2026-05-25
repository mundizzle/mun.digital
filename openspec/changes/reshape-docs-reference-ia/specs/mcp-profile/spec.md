## ADDED Requirements

### Requirement: MCP public docs
The docs app SHALL document the public `mundigital` MCP server.

#### Scenario: MCP docs are requested
- **WHEN** a user visits the MCP docs page
- **THEN** the page documents hosted Streamable HTTP access at `/api/mcp`, local stdio access through `mundigital mcp`, the `resume` resource, `search`, `brief`, `links_search`, `links_fetch`, and `fetch` tools, the `portfolio_brief` prompt, and verification commands
- **AND** public link tools are described as secondary public-link capabilities
- **AND** the page states that the MCP server is read-only and exposes sanitized public evidence only
- **AND** any sample output uses placeholders or sanitized public artifacts only
