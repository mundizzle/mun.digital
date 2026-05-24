# public-profile-data Specification

## Purpose
Define the editorial source, sanitized public profile data shape, evidence search behavior, and public career brief contract.
## Requirements
### Requirement: Editorial resume source
The system SHALL treat `packages/profile/data/resume.json` as the editorial source of truth for profile data.

#### Scenario: Public profile artifacts are generated
- **WHEN** public profile artifacts are built
- **THEN** they derive from the editorial resume source through the repository sanitizer and artifact builder

### Requirement: Sanitized public resume data
The system SHALL publish sanitized resume data with a schema version and without private contact fields unless explicitly allowed.

#### Scenario: Public resume is built with default contact policy
- **WHEN** `meta.publicContact.email` is not `true`
- **THEN** public resume JSON excludes `basics.phone`, `basics.email`, `basics.location.address`, `basics.location.postalCode`, and any nested `private` metadata

#### Scenario: Public email is explicitly enabled
- **WHEN** `meta.publicContact.email` is `true`
- **THEN** public resume JSON may include `basics.email` while still excluding phone, street address, postal code, and private metadata

### Requirement: Public resume evidence search
The system SHALL expose searchable public resume evidence derived only from sanitized resume content.

#### Scenario: Profile search receives a non-empty query
- **WHEN** a CLI or MCP search query matches public resume evidence
- **THEN** the system returns bounded evidence snippets with stable section labels and public source URLs

#### Scenario: Endorsement-oriented query is searched
- **WHEN** the query asks about endorsements, recommendations, references, or what people say about Mundi
- **THEN** search prioritizes public reference evidence

### Requirement: Public career brief
The system SHALL generate a public career brief from sanitized resume summary, profile links, skills, and selected work evidence.

#### Scenario: Brief is requested
- **WHEN** a CLI or MCP client requests a brief
- **THEN** the response contains only public profile content and excludes private metadata and private contact fields

### Requirement: Verification
The public profile data contract SHALL be protected by public data, profile, MCP, and package smoke checks.

#### Scenario: Profile-data verification runs
- **WHEN** maintainers verify profile data behavior
- **THEN** they run `pnpm run public:smoke`, `pnpm run profile:smoke`, `pnpm run mcp:smoke`, and `pnpm run pack:smoke`
