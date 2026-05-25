## Why

The first design-system slice established tokens, docs, Storybook, and `SectionHeader`, but the reference surfaces are still closer to scaffolding than a reviewer-ready system. This phase turns the existing slice into durable documentation and Storybook evidence without expanding the reusable component surface.

## What Changes

- Generate static token metadata from `design.tokens.json` alongside the existing generated CSS and expose it as `@mun.digital/tokens/metadata`.
- Add drift checks so generated token CSS and metadata must both match the token source.
- Annotate generated token CSS for future `storybook-design-token` compatibility, but keep token reference rendering metadata-first because the addon color presenter is not OKLCH-safe.
- Theme Storybook manager chrome and Docs with mun.digital colors and current font stacks.
- Expand docs content for token semantics, generated token reference, `SectionHeader`, Storybook workflow, agent workflow, static-safe routes, canonical metadata, and local-only MCP boundaries.
- Improve the existing `SectionHeader` stories with useful Docs, Controls, argTypes, and component/interaction test coverage.
- Replace the placeholder Storybook a11y script with a real Storybook test-runner based check for the current slice, graduating the checked story path to hard failures once zero violations is verified.
- Do not add new reusable UI components, profile data, or a broader web refactor in this phase.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `design-token-distribution`: add generated token metadata export, metadata drift checks, and Storybook-compatible token CSS annotations.
- `design-system-storybook`: add metadata-rendered token references, branded Storybook manager/docs theme, clearer SectionHeader controls/docs, component test path, and real a11y script behavior.
- `design-system-docs`: expand rendered reference documentation and keep docs routes/metadata static-safe and indexable.
- `shared-ui-vertical-slice`: strengthen Storybook acceptance evidence for the existing `SectionHeader` API without adding components.

## Impact

- Affected packages/apps: `packages/tokens`, `packages/ui`, `apps/storybook`, `apps/docs`.
- Public package interface: adds `@mun.digital/tokens/metadata`; keeps `@mun.digital/tokens/css` canonical.
- Dependencies: adds Storybook Vitest/browser testing and Markdown rendering dependencies.
- Verification: OpenSpec validation, token build/check/smoke, docs build and LLM smoke, Storybook build, Storybook component tests, Storybook a11y, repo lint/build, and browser checks for docs and Storybook surfaces.
