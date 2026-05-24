## Context

The current system exposes a public portfolio website, generated public profile artifacts, a public read-only CLI, and a public read-only MCP server. It also includes a private local Raindrop sync path that generates sanitized public link artifacts. These behaviors are documented across README, AGENTS.md, smoke tests, and source code, but not yet in OpenSpec.

## Goals / Non-Goals

**Goals:**
- Create canonical OpenSpec baseline specs for the current shipped system.
- Keep capability boundaries fine-grained enough for future feature specs to reference them directly.
- Preserve the data-boundary and read-only public-surface invariants as explicit requirements.
- Make verification ownership visible in each capability spec.

**Non-Goals:**
- Do not implement, fix, redesign, or refactor runtime behavior.
- Do not idealize behavior beyond what the repo currently implements.
- Do not create a separate testing capability for smoke scripts.
- Do not archive the change before review consensus.

## Decisions

- **Use one OpenSpec change for all backfilled specs.** The backfill is a single documentation/specification event, and splitting it would create coordination overhead without changing behavior.
- **Use fine-grained capability specs.** Public data, artifacts, website delivery, CLI, MCP, Raindrop sync, data safety, and package distribution change independently enough to deserve separate specs.
- **Keep public-data-safety cross-cutting.** Privacy and redaction invariants apply across resume data, Raindrop data, generated artifacts, CLI, MCP, website delivery, and package contents.
- **Keep package-distribution separate from CLI runtime behavior.** Published package safety and file allowlisting are different contracts from command behavior.
- **Attach verification notes to specs.** Smokes are process checks, not product capabilities; each capability names the smoke commands that protect it.

## Risks / Trade-offs

- **Backfill may overstate current behavior** -> Every requirement is derived from current code, README, AGENTS.md, or smoke tests.
- **Specs may duplicate README details** -> Specs focus on normative behavior and invariants, while README remains user-facing setup and usage documentation.
- **Specs may reveal behavior gaps** -> Any discovered gap becomes a separate OpenSpec change instead of being fixed in this PR.
- **Archiving too early can reduce review quality** -> Keep the change unarchived until Claude/Codex review and green checks.
