## Context

The current portfolio is a pnpm workspace with `apps/web` and `packages/profile`. The first design-system OpenSpec change established root `design.tokens.json`, generated semantic CSS, Tailwind 4 CSS-first usage, and a root `DESIGN.md`. The next step is to prove that those tokens can support public design-system surfaces without making the small portfolio app depend on ad hoc local CSS or profile-owned components.

Next.js 16 local docs confirm App Router project structure and `proxy.ts` as the current request interception convention. This change does not introduce deprecated `middleware.ts`.

## Goals / Non-Goals

**Goals:**
- Keep root `design.tokens.json` as the single token source of truth.
- Move generated token CSS distribution behind `packages/tokens`.
- Add Turborepo so shared package changes explicitly feed web, docs, and Storybook builds.
- Add `packages/ui` with a narrow, data-agnostic slice and `cn`.
- Refactor exactly one existing resume slice through shared UI as pipeline validation.
- Add Storybook and docs as public artifacts with separate responsibilities.
- Keep `mun.digital/llms.txt` profile/resume-oriented and add docs-only LLM outputs under the docs app.
- Make Storybook reachable but noindexed, and keep Storybook MCP local-development-only.

**Non-Goals:**
- Do not extract every resume component in this change.
- Do not redesign the portfolio visual language.
- Do not add a deployed MCP runtime for Storybook.
- Do not introduce profile-data fetching or editorial ownership into `packages/ui`.
- Do not make docs own resume/profile LLM content.
- Do not force Base UI into static components; install/configure it only when the slice introduces a real interactive primitive.

## Architecture

### Workspace Layout

- `apps/web`: Existing Next.js portfolio, consuming `@mun.digital/profile`, `@mun.digital/tokens/css`, and the validated shared UI slice.
- `apps/docs`: Next.js docs app with design-system documentation and docs-only LLM/static Markdown routes.
- `apps/storybook`: Storybook project using `@storybook/nextjs-vite`.
- `packages/tokens`: Generated CSS distribution package. It owns emitted CSS artifacts generated from root `design.tokens.json`.
- `packages/ui`: Data-agnostic React components and utilities. It imports token CSS only for package-level stylesheet export; component code uses semantic class names.

### Token Distribution

The root generator continues to validate DTCG-style structured OKLCH tokens. Output moves from `apps/web/src/app/tokens.generated.css` to `packages/tokens/css/tokens.generated.css`. Apps import `@mun.digital/tokens/css`.

The old web-local generated file is removed after imports are updated. `pnpm design:build` writes the package artifact and `pnpm design:check` compares it deterministically.

### Shared UI Slice

The first slice extracts `SectionHeader` because it is data-agnostic, static, and already reused across resume sections. The component remains typography-light and accepts class overrides for layout context. `packages/ui` exposes:

- `cn(...inputs)` using `clsx` and `tailwind-merge`.
- `SectionHeader` as a presentational component.
- `styles.css` for consumers that need token CSS and package-level CSS imports.

CVA is deferred because the slice does not yet have meaningful variant complexity.

### Storybook

Storybook lives in `apps/storybook` and targets `@mun.digital/ui`. It uses:

- `@storybook/nextjs-vite` framework.
- Docs and controls via default autodocs.
- `@storybook/addon-a11y` configured in a warning/todo posture for the first slice.
- `@storybook/addon-mcp` for local agent workflows only.
- MSW preview setup with empty handlers unless a component needs network-like data.

The static Storybook output is public but noindexed. Static deployment must not imply any live MCP endpoint.

### Docs And LLM

`apps/docs` documents the token model, shared UI usage, architecture, Storybook workflow, and agentic design-system workflow. It exposes:

- `llms.txt`
- `llms-full.txt`
- per-page `.md` routes for docs content
- copy/view Markdown links from docs pages

The implementation may start with a lightweight local MDX/Markdown source adapter and Fumadocs dependencies/config, then grow deeper Fumadocs UI integration as the docs surface expands. The acceptance contract is that docs content, Markdown routes, and design-system-only LLM outputs resolve and build.

### Deployment

Vercel projects should use:

- Web: existing `apps/web` root.
- Docs: `apps/docs`, domain `docs.mun.digital`, indexable robots policy.
- Storybook: `apps/storybook`, domain `storybook.mun.digital`, static build, `X-Robots-Tag: noindex, nofollow`, and `robots.txt` disallow-all.

Turborepo inputs include shared package outputs so changes in tokens or UI invalidate all affected builds.

## Risks / Trade-offs

- **Scope creep:** Limit implementation to one vertical slice and specs for scale-out gates.
- **Token drift across apps:** One generated package CSS artifact plus smoke checks compare consumer visibility.
- **UI package coupling:** `packages/ui` must not import profile data, docs-specific prose styling, or app-owned helpers.
- **Storybook MCP confusion:** Add local-only config/documentation and no deployed MCP route.
- **Docs/profile LLM confusion:** Add explicit cross-links without merging content responsibilities.
- **Vercel rebuild gaps:** Turborepo package dependencies and app package dependencies make shared changes visible to each project.

## Verification

- `pnpm design:build`
- `pnpm design:check`
- `pnpm run lint`
- `pnpm run build`
- `pnpm run docs:build`
- `pnpm run docs:llms:smoke`
- `pnpm run storybook:build`
- `pnpm run storybook:a11y`
- Existing profile/public/MCP/package smoke checks where touched.
