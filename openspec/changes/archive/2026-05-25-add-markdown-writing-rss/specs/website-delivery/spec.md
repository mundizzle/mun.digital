## MODIFIED Requirements

### Requirement: Portfolio website delivery
The system SHALL serve the public portfolio website at `mun.digital` through the Next.js App Router web app.

#### Scenario: Site homepage is requested
- **WHEN** a browser or agent requests the site homepage as HTML
- **THEN** the web app serves the public landing portfolio experience
- **AND** the landing experience may use app-local work, agent-surface, and reading-rail content
- **AND** the landing writing teaser is backed by the newest local Markdown writing post

#### Scenario: Resume page is requested
- **WHEN** a browser or agent requests `/resume`
- **THEN** the web app serves the public resume experience backed by sanitized public profile data

#### Scenario: Work routes are requested
- **WHEN** a browser or agent requests `/work` or a known `/work/[id]` route
- **THEN** the web app serves fixture-backed work UI for the portfolio UI port

#### Scenario: Writing routes are requested
- **WHEN** a browser or agent requests `/writing` or a known `/writing/[id]` route
- **THEN** the web app serves static writing content sourced from local Markdown files under `apps/web/content/writing`
- **AND** each writing post requires only `title` and `date` frontmatter
- **AND** the post slug is derived from the Markdown filename
- **AND** the article page renders Markdown content without tags, read-time metadata, structured body fixtures, or tools-mentioned footer copy

### Requirement: Metadata routes
The system SHALL expose metadata routes for crawler and agent discovery.

#### Scenario: Sitemap is requested
- **WHEN** a client requests `/sitemap.xml`
- **THEN** the response includes public site, resume, work, writing, RSS, and artifact URLs that are intended for discovery

#### Scenario: RSS feed is requested
- **WHEN** a client requests `/rss.xml`
- **THEN** the response is an RSS XML feed for Markdown-backed writing posts
- **AND** the feed includes absolute `https://mun.digital/writing/[slug]` item links
- **AND** item dates are emitted as RFC-822 `pubDate` values
- **AND** the feed includes an Atom self link and `content:encoded` article HTML

#### Scenario: RSS discovery is requested
- **WHEN** a browser or feed reader inspects any portfolio HTML page
- **THEN** the document metadata advertises `/rss.xml` as an alternate RSS feed titled `mun.digital Writing`
- **AND** the visible footer RSS link points to `/rss.xml`

### Requirement: Verification
The website delivery contract SHALL be protected by build and HTTP smoke checks.

#### Scenario: Website verification runs
- **WHEN** maintainers verify website delivery
- **THEN** they run `pnpm run build`, `pnpm run llms:smoke`, and `pnpm run mcp:http:smoke http://localhost:3000/api/mcp` against a local server when the HTTP route is changed
- **AND** they run focused unit tests and RSS smoke coverage when writing or RSS delivery changes
