# website-delivery Specification

## Purpose
Define how the portfolio website serves public pages, static artifacts, metadata routes, Markdown negotiation, and hosted MCP access.
## Requirements
### Requirement: Portfolio website delivery
The system SHALL serve the public portfolio website at `mun.digital` through the Next.js App Router web app.

#### Scenario: Site homepage is requested
- **WHEN** a browser or agent requests the site homepage
- **THEN** the web app serves the public portfolio experience backed by sanitized public profile artifacts

### Requirement: Static public artifacts
The system SHALL serve mirrored public artifacts from the web app public directory.

#### Scenario: Public artifact URL is requested
- **WHEN** a client requests `/resume.json`, `/resume.md`, `/mundi-morgado-resume.pdf`, `/resume.pdf`, `/raindrops.json`, or `/llms.txt`
- **THEN** the web app serves the corresponding sanitized public artifact without authentication

### Requirement: Metadata routes
The system SHALL expose metadata routes for crawler and agent discovery.

#### Scenario: Sitemap is requested
- **WHEN** a client requests `/sitemap.xml`
- **THEN** the response includes public site and artifact URLs that are intended for discovery

#### Scenario: Robots policy is requested
- **WHEN** a client requests `/robots.txt`
- **THEN** the response reflects the repository's public indexing policy

### Requirement: Markdown content negotiation
The system SHALL support Markdown-oriented agent access for the homepage.

#### Scenario: Markdown is requested
- **WHEN** a client requests the homepage with `Accept: text/markdown`
- **THEN** the response provides Markdown-oriented public profile content suitable for agents

### Requirement: HTTP MCP route seam
The system SHALL expose the public MCP server through the web app HTTP route.

#### Scenario: Hosted MCP endpoint is requested
- **WHEN** an MCP client connects to `/api/mcp`
- **THEN** the route serves the read-only `mundigital` MCP interface over Streamable HTTP

### Requirement: Verification
The website delivery contract SHALL be protected by build and HTTP smoke checks.

#### Scenario: Website verification runs
- **WHEN** maintainers verify website delivery
- **THEN** they run `pnpm run build`, `pnpm run llms:smoke`, and `pnpm run mcp:http:smoke http://localhost:3000/api/mcp` against a local server when the HTTP route is changed
