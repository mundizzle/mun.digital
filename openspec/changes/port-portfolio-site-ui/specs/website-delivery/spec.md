## MODIFIED Requirements

### Requirement: Portfolio website delivery
The system SHALL serve the public portfolio website at `mun.digital` through the Next.js App Router web app.

#### Scenario: Site homepage is requested
- **WHEN** a browser or agent requests the site homepage as HTML
- **THEN** the web app serves the public landing portfolio experience
- **AND** the landing experience may use app-local temporary UI-port fixture content for visual-only work, writing, agent-surface, and reading-rail modules
- **AND** the fixture content does not become profile source data or generated public artifact data

#### Scenario: Resume page is requested
- **WHEN** a browser or agent requests `/resume`
- **THEN** the web app serves the public resume experience backed by sanitized public profile data

#### Scenario: Work routes are requested
- **WHEN** a browser or agent requests `/work` or a known `/work/[id]` route
- **THEN** the web app serves fixture-backed work UI for the portfolio UI port

#### Scenario: Writing routes are requested
- **WHEN** a browser or agent requests `/writing` or a known `/writing/[id]` route
- **THEN** the web app serves fixture-backed writing UI for the portfolio UI port

### Requirement: Metadata routes
The system SHALL expose metadata routes for crawler and agent discovery.

#### Scenario: Sitemap is requested
- **WHEN** a client requests `/sitemap.xml`
- **THEN** the response includes public site, resume, work, writing, and artifact URLs that are intended for discovery

### Requirement: Markdown content negotiation
The system SHALL support Markdown-oriented agent access for the homepage.

#### Scenario: Markdown is requested
- **WHEN** a client requests the homepage with `Accept: text/markdown`
- **THEN** the response provides the canonical public resume Markdown from `/resume.md`
- **AND** this Markdown response remains intentional even though the homepage HTML response is the landing experience

### Requirement: Verification
The website delivery contract SHALL be protected by build and HTTP smoke checks.

#### Scenario: Website verification runs
- **WHEN** maintainers verify website delivery
- **THEN** they run `pnpm run build`, `pnpm run llms:smoke`, and `pnpm run mcp:http:smoke http://localhost:3000/api/mcp` against a local server when the HTTP route is changed
- **AND** they browser-verify the landing, resume, work, and writing routes when the UI port changes those surfaces
