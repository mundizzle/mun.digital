## MODIFIED Requirements

### Requirement: Collection allowlist

The system SHALL publish only Raindrop items from configured allowlisted user collections with positive ids.

#### Scenario: System collection is configured
- **WHEN** configuration includes a collection id of `0` or a negative value such as `-1` or `-99`
- **THEN** Raindrop sync fails before calling the API

#### Scenario: Child collection is not listed
- **WHEN** a Raindrop item belongs to a child collection whose id is not explicitly listed in configuration
- **THEN** the item is omitted from the public snapshot

### Requirement: Required public tag

The system SHALL publish only Raindrop items that include at least one configured required public tag.

#### Scenario: Required tag is present
- **WHEN** an allowlisted Raindrop item is tagged `mun.digital` or `#mun.digital`
- **THEN** the item is eligible for public snapshot sanitization

#### Scenario: Required tag is missing
- **WHEN** an allowlisted Raindrop item does not include any configured required tag
- **THEN** the item is omitted from the public snapshot

#### Scenario: Required tags are empty
- **WHEN** configuration has no required public tags
- **THEN** no Raindrop item is published

### Requirement: Private item exclusion

The system SHALL omit any Raindrop item carrying a configured private tag or private tag prefix.

#### Scenario: Item has private tag
- **WHEN** an item is allowlisted and also has a private tag such as `private`
- **THEN** the entire item is omitted from the public snapshot

#### Scenario: Item has private tag prefix
- **WHEN** an item is allowlisted and has a tag beginning with a private prefix such as `_draft`
- **THEN** the entire item is omitted from the public snapshot

### Requirement: Deterministic public snapshot

The system SHALL generate a deterministic public Raindrop snapshot.

#### Scenario: Tags are normalized
- **WHEN** Raindrop tags include different casing, duplicate values, or leading `#`
- **THEN** matching and public output use lowercased deduped tags without leading `#`

### Requirement: Scheduled sync pull request

The system SHALL provide scheduled automation that syncs Raindrop into a pull request instead of pushing directly to main.

#### Scenario: Scheduled sync runs
- **WHEN** the daily Raindrop sync workflow runs
- **THEN** it uses the `RAINDROP_TOKEN` GitHub secret
- **AND** runs sync and verification before opening or updating a pull request

#### Scenario: Sync has no changes
- **WHEN** the daily Raindrop sync produces no artifact changes
- **THEN** no generated-data pull request is opened
