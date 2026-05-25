## MODIFIED Requirements

### Requirement: Portfolio website delivery
The system SHALL serve the public portfolio website at `mun.digital` through the Next.js App Router web app.

#### Scenario: Site homepage is requested
- **WHEN** a browser or agent requests the site homepage
- **THEN** the web app serves the public portfolio experience backed by sanitized public profile artifacts
- **AND** the Reading rail renders external links from the generated public Raindrop snapshot
- **AND** Reading rail cards with `thumbnailUrl` render a decorative lazy thumbnail image
- **AND** Reading rail cards without `thumbnailUrl` remain text-only
