## ADDED Requirements

### Requirement: MCP server identity
The system SHALL expose a public read-only MCP server named `mundigital`.

#### Scenario: MCP tools are listed
- **WHEN** an MCP client lists server capabilities
- **THEN** the server exposes the expected public profile and public links tools without requiring authentication

### Requirement: Resume resource
The system SHALL expose a `mun://resume` MCP resource containing sanitized public resume JSON.

#### Scenario: Resume resource is read
- **WHEN** an MCP client reads `mun://resume`
- **THEN** the server returns sanitized public resume JSON with an `application/json` MIME type

### Requirement: Profile tools
The system SHALL expose read-only `search`, `brief`, and `fetch` tools for public profile evidence.

#### Scenario: Profile evidence is searched
- **WHEN** a client calls `search` with a non-empty query
- **THEN** the server returns bounded public evidence snippets suitable for follow-up with `fetch`

#### Scenario: Profile evidence is fetched
- **WHEN** a client calls `fetch` with an evidence id from search
- **THEN** the server returns the full public evidence item and public metadata

#### Scenario: Portfolio brief is generated
- **WHEN** a client calls `brief`
- **THEN** the server returns an agent-ready public career brief

### Requirement: Public links tools
The system SHALL expose read-only `links_search` and `links_fetch` tools for sanitized public Raindrop links.

#### Scenario: Public links are searched
- **WHEN** a client calls `links_search` with a non-empty query
- **THEN** the server returns matching sanitized public link results suitable for follow-up with `links_fetch`

#### Scenario: Public link is fetched
- **WHEN** a client calls `links_fetch` with an id from `links_search`
- **THEN** the server returns the sanitized public link or a clear not-found error

### Requirement: Portfolio prompt
The system SHALL expose a `portfolio_brief` prompt that constrains clients to public MCP evidence.

#### Scenario: Prompt is requested
- **WHEN** a client requests the `portfolio_brief` prompt
- **THEN** the prompt instructs the client to use only public resume evidence from the MCP server and not invent details

### Requirement: MCP transports
The system SHALL support both local stdio and hosted Streamable HTTP MCP access.

#### Scenario: Stdio MCP is started
- **WHEN** `mundigital mcp` is launched by an MCP client
- **THEN** the server communicates over stdio

#### Scenario: Hosted MCP is requested
- **WHEN** a client connects to `https://mun.digital/api/mcp`
- **THEN** the server communicates over Streamable HTTP through the web app route

### Requirement: Verification
The MCP profile contract SHALL be protected by stdio and HTTP MCP smoke checks.

#### Scenario: MCP verification runs
- **WHEN** maintainers verify MCP behavior
- **THEN** they run `pnpm run mcp:smoke` and `pnpm run mcp:http:smoke http://localhost:3000/api/mcp`
