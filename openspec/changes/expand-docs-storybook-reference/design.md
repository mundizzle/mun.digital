## Context

The existing vertical slice has a shared token package, a Fumadocs-backed docs app, a Storybook app, and one reusable component (`SectionHeader`). The next phase is reference-quality documentation and Storybook evidence for that slice, not a component expansion.

Constraints:

- `design.tokens.json` remains the source of truth for design tokens.
- `@mun.digital/tokens/css` remains the canonical CSS export.
- `@mun.digital/tokens/metadata` must be generated from the same source and committed as static data.
- Storybook token browsing must use the generated token CSS, not an alternate token file.
- Storybook MCP documentation must be local-development-only; static Storybook must not imply a live MCP endpoint.
- Docs and Storybook must not import or expose profile/resume private data.

## Goals / Non-Goals

**Goals:**

- Make token CSS and token metadata a single generated contract with drift checks.
- Make Storybook useful as a component, token, testing, and accessibility workbench for `SectionHeader`.
- Brand Storybook manager chrome and Docs with mun.digital colors and font intent.
- Expand docs into a polished reference surface that renders as pages and also exports Markdown and LLM text.
- Establish a real Storybook test-runner path for interaction/unit and a11y checks.

**Non-Goals:**

- No new reusable UI components.
- No broader portfolio web refactor.
- No additional profile/resume content source.
- No live MCP endpoint in static Storybook.
- No write/deploy/shell behavior added to public CLI or MCP surfaces.

## Decisions

1. Generate metadata in the existing token build script.

   `scripts/build-design-tokens.mjs` already resolves token aliases and writes generated CSS. Extending it keeps CSS and metadata derived from the same parser, serializer, and check mode. Alternatives considered: hand-maintained metadata or a second build script. Both introduce drift risk.

2. Keep metadata as generated ESM static data.

   The package will expose `@mun.digital/tokens/metadata` from `packages/tokens/metadata/tokens.generated.mjs`. ESM works in Storybook, docs, and smoke scripts without a TypeScript build step. Alternatives considered: JSON export only, which is less ergonomic for typed JS imports and still needs package export handling.

3. Make metadata the generated token reference.

   Docs and Storybook token reference tables will render from `@mun.digital/tokens/metadata`, which is generated from `design.tokens.json` and supports light/dark semantic values without parsing CSS.

4. Annotate generated CSS for future Storybook token browsing.

   `storybook-design-token` reads comments from CSS, so the generator will group comments by categories such as `Colors` and `Layout`. The addon is not registered in public Storybook in this phase because its color presenter uses `polished`, which does not parse OKLCH values. The annotations are harmless CSS comments and keep a future path open if the addon becomes OKLCH-safe.

5. Theme Storybook through a shared local theme module.

   A `.storybook/mun-digital-theme.ts` module built with `storybook/theming` will be imported by both `manager.ts` and `preview.ts`. This keeps manager chrome and Docs visually aligned while avoiding duplicated theme constants.

6. Use Storybook Vitest as the primary component/interaction path and test-runner for a11y.

   Component smoke and interaction checks should run through `@storybook/addon-vitest` using browser mode against stories. Accessibility checks should build static Storybook, serve it locally, and run the Storybook test-runner so `parameters.a11y.test = "error"` exits nonzero on violations. The Playwright browser dependency required by Vitest browser mode and the test runner must be available locally/CI.

7. Use a vetted Markdown renderer for docs pages and remove unused Fumadocs wiring.

   The docs app currently has Fumadocs dependencies/config installed but bypassed by a hand-rolled renderer. For this reference pass, use `react-markdown` plus `remark-gfm` to render the current Markdown-compatible `.mdx` content and remove unused Fumadocs deps/config/CSS. This avoids a bespoke parser while keeping the docs app small and explicit.

## Risks / Trade-offs

- `storybook-design-token` compatibility risk with OKLCH values -> Mitigate by keeping metadata-rendered token reference as the public docs path and deferring addon registration.
- A11y test-runner may require a running Storybook -> Mitigate with a script that starts Storybook for CI-like local runs and uses hard failures for the checked slice.
- Generated metadata can become over-modeled -> Mitigate by exposing only stable fields needed for docs and Storybook: name, css variable, type, category, mode, value, resolved value, and source path.
- Markdown rendering dependency adds a small docs-app dependency -> Mitigate by removing unused Fumadocs dependencies and using a mature Markdown/GFM renderer instead of custom parsing.
- The branch touches multiple apps -> Mitigate with OpenSpec validation, targeted smoke scripts, builds, and browser verification.

## Migration Plan

1. Add OpenSpec deltas and get cross-agent review before coding.
2. Update token generation, package exports, generated artifacts, and smoke checks.
3. Replace unused Fumadocs wiring with a vetted Markdown renderer.
4. Add Storybook theme files and test/a11y scripts.
5. Expand `SectionHeader` stories and docs content.
6. Verify docs and Storybook builds, foundation smoke checks, and browser rendering.

Rollback is straightforward: revert this branch. Public runtime behavior for `mun.digital` web is not intended to change.

## Open Questions

- None currently. `storybook-design-token` registration is deferred until its color presenter is OKLCH-safe.
