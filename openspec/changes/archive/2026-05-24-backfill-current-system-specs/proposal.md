## Why

OpenSpec is now the repository's spec-driven workflow, but the shipped system has no canonical baseline specs. Backfilling current behavior first gives future feature specs, especially the upcoming Raindrop-on-site work, a reliable contract to extend.

## What Changes

- Add OpenSpec specs that document current shipped behavior across data, artifacts, website delivery, CLI, MCP, Raindrop sync, package distribution, and public-data safety.
- Keep the backfill descriptive only: no runtime code, package, data, route, deployment, or smoke-test behavior changes.
- Use verification notes inside each capability spec instead of creating a separate testing capability.
- Leave discovered behavior gaps or bugs for separate future OpenSpec changes.

## Capabilities

### New Capabilities
- `public-profile-data`: Defines the editorial resume source, sanitized public resume shape, and profile evidence semantics.
- `artifact-generation`: Defines generated public artifacts, mirroring behavior, resume outputs, and `llms.txt` artifact expectations.
- `website-delivery`: Defines website delivery of public pages, public artifacts, metadata routes, Markdown negotiation, and the HTTP MCP seam.
- `cli-profile`: Defines the read-only `mundigital` CLI profile, search, brief, links, and MCP commands.
- `mcp-profile`: Defines the read-only MCP resource, prompt, profile tools, link tools, and stdio/HTTP transport behavior.
- `raindrop-sync`: Defines private local Raindrop sync, collection allowlisting, public link snapshot sanitization, and fail-closed behavior.
- `public-data-safety`: Defines cross-surface private-data redaction and public-data boundary invariants.
- `package-distribution`: Defines the npm package contents, binary, install behavior, and publish-time safety constraints.

### Modified Capabilities

## Impact

- Adds OpenSpec change files under `openspec/changes/backfill-current-system-specs/`.
- Does not alter application runtime behavior, generated public artifacts, CLI/MCP behavior, package contents, or deployment configuration.
- The change should be archived to canonical `openspec/specs/` only after review consensus and green checks.
