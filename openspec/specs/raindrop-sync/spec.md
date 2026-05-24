# raindrop-sync Specification

## Purpose
Define private local Raindrop sync behavior and the sanitized public link snapshot used by website, CLI, MCP, and package surfaces.
## Requirements
### Requirement: Private local sync only
The system SHALL sync Raindrop bookmarks only through a private local command that uses `RAINDROP_TOKEN`.

#### Scenario: Sync token is missing
- **WHEN** `pnpm run raindrop:sync` runs without `RAINDROP_TOKEN`
- **THEN** the command fails clearly and does not overwrite the existing public Raindrop artifact

#### Scenario: Public runtime uses links
- **WHEN** the website, CLI, hosted MCP, or npm package exposes curated links
- **THEN** it reads the generated public snapshot and does not call the live Raindrop API

### Requirement: Collection allowlist
The system SHALL publish only Raindrop items from configured allowlisted collections.

#### Scenario: Item collection is not allowlisted
- **WHEN** a Raindrop API item belongs to a collection not listed in the configuration
- **THEN** the item is omitted from the public snapshot

#### Scenario: Collection is published
- **WHEN** an allowlisted collection is included in the public snapshot
- **THEN** the public link uses the configured slug or label instead of the raw Raindrop collection id

### Requirement: Link sanitizer allowlist
The system SHALL build each public Raindrop link from an explicit allowlist of fields.

#### Scenario: Link is sanitized
- **WHEN** a Raindrop item is accepted for publication
- **THEN** the public object contains only id, title, url, excerpt, tags, collection, created, and updated

#### Scenario: Private link fields exist
- **WHEN** a Raindrop item contains fields such as note, user, creatorRef, media, cache, file, cover, or collectionId
- **THEN** those fields are not emitted in public artifacts, CLI output, MCP output, or package contents

### Requirement: Public URL safety
The system SHALL publish only HTTP and HTTPS Raindrop link URLs.

#### Scenario: Unsafe URL scheme is synced
- **WHEN** a Raindrop item uses a non-HTTP(S) URL scheme
- **THEN** the item is omitted from the public snapshot

### Requirement: Deterministic public snapshot
The system SHALL generate a deterministic public Raindrop snapshot.

#### Scenario: Snapshot is generated
- **WHEN** the same Raindrop items and config are sanitized
- **THEN** the output has stable schema version, string ids, ISO dates, sorted tags, and stable link ordering

### Requirement: Fail-closed sync
The system SHALL refuse to overwrite the public Raindrop artifact on unsafe or empty sync results.

#### Scenario: Raindrop API returns no items
- **WHEN** the API returns no raw items
- **THEN** sync fails before writing the public artifact

#### Scenario: Sanitization produces no public links
- **WHEN** raw items are returned but all are removed by sanitization
- **THEN** sync fails before writing the public artifact

#### Scenario: Pagination does not terminate
- **WHEN** the API keeps returning full pages beyond the configured maximum
- **THEN** sync fails instead of looping indefinitely

### Requirement: Verification
The Raindrop sync contract SHALL be protected by Raindrop, public-data, MCP, profile, and package smoke checks.

#### Scenario: Raindrop verification runs
- **WHEN** maintainers verify Raindrop behavior
- **THEN** they run `pnpm run raindrop:smoke`, `pnpm run public:smoke`, `pnpm run profile:smoke`, `pnpm run mcp:smoke`, and `pnpm run pack:smoke`
