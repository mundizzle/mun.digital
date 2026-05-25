## Why

The live website currently presents the resume as the homepage. Claude Design now defines the target visual direction for a multi-surface `mun.digital` portfolio: landing, resume, work, writing, and a landing-only reading rail. This change ports that end-state UI into the real Next.js app without adding real content infrastructure.

## What Changes

- Replace the homepage HTML experience with the Claude Design landing page.
- Move the current resume page to `/resume`, still backed by sanitized profile data.
- Add `/work`, `/work/[id]`, `/writing`, and `/writing/[id]` routes using temporary app-local fixture content.
- Add site chrome, landing modules, work views, writing views, and the landing reading rail.
- Preserve `/` Markdown negotiation so `Accept: text/markdown` still returns canonical public resume Markdown from `/resume.md`.
- Keep public generated artifacts, Raindrop sync, CLI, MCP, tokens, and deployment behavior unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `website-delivery`: homepage HTML becomes the landing experience; resume moves to `/resume`; new public portfolio routes are discoverable; homepage Markdown negotiation remains an intentional profile Markdown contract.

## Impact

- Affected app: `apps/web`.
- Affected routes: `/`, `/resume`, `/work`, `/work/[id]`, `/writing`, `/writing/[id]`, `/sitemap.xml`.
- Affected spec: `website-delivery`.
- Fixture data is app-local visual content only. It is not profile source data, not generated public artifact data, and does not alter `public-data-safety` or `raindrop-sync` contracts.
- Verification: OpenSpec strict validation, web lint/build, public surface smoke checks, and browser verification across the new routes.
