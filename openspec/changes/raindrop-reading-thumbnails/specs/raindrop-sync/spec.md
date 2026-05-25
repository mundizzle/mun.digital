## MODIFIED Requirements

### Requirement: Link sanitizer allowlist
The system SHALL build each public Raindrop link from an explicit allowlist of fields.

#### Scenario: Link is sanitized
- **WHEN** a Raindrop item is accepted for publication
- **THEN** the public object contains only id, title, url, excerpt, tags, collection, created, updated, and optional thumbnailUrl

#### Scenario: Link thumbnail is sanitized
- **WHEN** a Raindrop item contains a safe HTTP(S) cover URL
- **THEN** the public object may include `thumbnailUrl` using that URL
- **AND** raw `cover` is not emitted

#### Scenario: Link media thumbnail is sanitized
- **WHEN** a Raindrop item has no safe cover URL and contains a safe HTTP(S) `media[].link`
- **THEN** the public object may include `thumbnailUrl` using the first safe media link
- **AND** raw `media` is not emitted

#### Scenario: Unsafe thumbnail exists
- **WHEN** a Raindrop item contains unsafe thumbnail schemes such as data, blob, file, or javascript
- **THEN** those thumbnail values are omitted from the public object

#### Scenario: Private link fields exist
- **WHEN** a Raindrop item contains fields such as note, user, creatorRef, media, cache, file, cover, or collectionId
- **THEN** those fields are not emitted in public artifacts, CLI output, MCP output, or package contents

### Requirement: Deterministic public snapshot
The system SHALL generate a deterministic public Raindrop snapshot.

#### Scenario: Snapshot is generated
- **WHEN** the same Raindrop items and config are sanitized
- **THEN** the output has stable schema version `1.1.0`, string ids, ISO dates, sorted tags, sanitized optional thumbnail URLs, and stable link ordering

### Requirement: Private local sync only
The system SHALL sync Raindrop bookmarks only through a private local command that uses `RAINDROP_TOKEN`.

#### Scenario: Public runtime uses links
- **WHEN** the website, CLI, hosted MCP, or npm package exposes curated links
- **THEN** it reads the generated public snapshot and does not call the live Raindrop API
- **AND** surfaces that return full public link objects may include sanitized `thumbnailUrl`
