## Why

The Raindrop snapshot pipeline exists, but it is still configured as an empty placeholder. Real use needs a safe publishing gate so only intentionally tagged public bookmarks become portfolio, CLI, MCP, and package data.

## What Changes

- Require synced bookmarks to be in an allowlisted collection and tagged `mun.digital`.
- Exclude any item with private tags or private tag prefixes instead of merely hiding those tags.
- Normalize Raindrop tags by lowercasing, trimming, stripping a leading `#`, and deduping before matching or publishing.
- Add a local `raindrop:collections` helper that lists root and child collection ids without logging `RAINDROP_TOKEN`.
- Reject Raindrop system and aggregate collection ids such as `0`, `-1`, and `-99` in configured publish collections.
- Prepare for a follow-up scheduled sync PR after collection ids are selected.

## Capabilities

### New Capabilities

- `raindrop-collection-discovery`: Local token-backed collection discovery for choosing explicit publish allowlist ids.

### Modified Capabilities

- `raindrop-sync`: Add required public tag gating, item-level private tag exclusion, normalized tags, and config validation.

## Impact

- Affected code: Raindrop sync and smoke scripts in `packages/profile` and root scripts.
- Public artifacts: `raindrops.json` schema stays at `1.0.0`; only publication eligibility changes.
- Public interfaces: website, CLI, MCP, npm package, and `/raindrops.json` continue reading the generated public snapshot only.
- Verification: OpenSpec validation, Raindrop smoke, public/profile/MCP/package smokes, lint, and build.
