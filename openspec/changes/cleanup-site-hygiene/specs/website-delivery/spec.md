## MODIFIED Requirements

### Requirement: Portfolio website delivery
The system SHALL serve the public portfolio website at `mun.digital` through the Next.js App Router web app.

#### Scenario: Site homepage is requested
- **WHEN** a browser or agent requests the site homepage
- **THEN** the web app serves the public portfolio experience backed by sanitized public profile artifacts
- **AND** the site nav presents the personal brand as `mundi.morgado` with the dot in the primary accent color
- **AND** the hero card may present an abstract decorative backdrop and portrait without visible title or tagline copy inside the card
- **AND** the rotating role text appears above the hero card
- **AND** the homepage omits the testimonial block
- **AND** framed homepage panels use a standard light border and subtle Tailwind shadow treatment
- **AND** the homepage provides a valid page-level heading for assistive technology and document structure

#### Scenario: Agents section is requested
- **WHEN** a browser views the homepage Agents section
- **THEN** the section lists only public-ready agent surfaces
- **AND** Storybook and Design System links are not shown
- **AND** the MCP row displays the hosted MCP endpoint while linking browser users to MCP documentation

### Requirement: Verification
The website delivery contract SHALL be protected by build, smoke, and browser checks.

#### Scenario: Website verification runs
- **WHEN** maintainers verify website delivery
- **THEN** they run `pnpm run lint`, `pnpm run test:unit`, `pnpm run build`, and relevant public smoke checks
- **AND** they browser-verify the changed homepage, work, writing, and resume surfaces
