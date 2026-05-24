# public-data-safety Specification

## Purpose
Define cross-surface privacy, redaction, read-only behavior, sanctioned data sources, and secret-handling invariants.
## Requirements
### Requirement: Private resume data exclusion
The system SHALL exclude private resume fields from every public surface.

#### Scenario: Public resume data is emitted
- **WHEN** resume data is written to public artifacts, served by the website, returned by CLI, returned by MCP, or packed for npm
- **THEN** it excludes `basics.phone`, `basics.location.address`, `basics.location.postalCode`, and all `private` metadata

#### Scenario: Email is not opted into public contact
- **WHEN** `meta.publicContact.email` is not `true`
- **THEN** `basics.email` is excluded from every public resume surface

### Requirement: Private Raindrop data exclusion
The system SHALL exclude private Raindrop fields from every public surface.

#### Scenario: Public Raindrop data is emitted
- **WHEN** Raindrop data is written to public artifacts, served by the website, returned by CLI, returned by MCP, or packed for npm
- **THEN** it excludes note, user, creatorRef, media, cache, file, cover, raw collection ids, and non-allowlisted collections

### Requirement: Public surfaces are read-only
Public CLI, MCP, website, and package surfaces SHALL NOT expose write, deploy, shell, arbitrary filesystem, environment, secret, telemetry, or postinstall behavior.

#### Scenario: Public interface is used
- **WHEN** a client uses the hosted MCP endpoint, local stdio MCP server, CLI commands, website artifacts, or npm package
- **THEN** the interface provides read-only public profile or link data and cannot mutate local systems, deployments, secrets, or source data

### Requirement: Public artifacts are generated from sanctioned sources
The system SHALL avoid parallel public content sources for profile data.

#### Scenario: Public profile content is generated
- **WHEN** public profile data is built or served
- **THEN** it derives from the editorial resume source and sanitized generated artifacts rather than a separate public content source

### Requirement: Secrets are never committed or logged
The system SHALL keep credentials out of repository files, generated artifacts, logs, and commits.

#### Scenario: Private credentials are needed
- **WHEN** a local command needs credentials such as `RAINDROP_TOKEN`
- **THEN** the credential is supplied for that command/session only and not written to tracked files or generated public artifacts

### Requirement: Verification
The public data safety contract SHALL be protected by all public-surface smoke checks.

#### Scenario: Public safety verification runs
- **WHEN** maintainers verify public data safety
- **THEN** they run `pnpm run public:smoke`, `pnpm run raindrop:smoke`, `pnpm run profile:smoke`, `pnpm run mcp:smoke`, and `pnpm run pack:smoke`
