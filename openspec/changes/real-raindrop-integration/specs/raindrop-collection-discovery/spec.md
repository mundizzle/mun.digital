## ADDED Requirements

### Requirement: Local collection discovery

The system SHALL provide a private local command for listing Raindrop collection ids to support explicit allowlist configuration.

#### Scenario: Token is missing
- **WHEN** `pnpm run raindrop:collections` runs without `RAINDROP_TOKEN`
- **THEN** the command fails clearly without writing files

#### Scenario: Collections are listed
- **WHEN** `pnpm run raindrop:collections` runs with `RAINDROP_TOKEN`
- **THEN** it reads Raindrop root and child collections
- **AND** prints id, title, count, public flag, and parent id when present
- **AND** does not print the token

#### Scenario: Collection listing fails
- **WHEN** the Raindrop API returns an error
- **THEN** the command fails clearly without writing files
