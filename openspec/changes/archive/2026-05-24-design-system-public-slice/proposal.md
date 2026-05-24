## Why

The portfolio design system now has machine-readable tokens, but it is not yet a public, reusable artifact across apps, shared UI, Storybook, docs, LLM documentation, and deployment boundaries. This change proves one vertical slice end-to-end before scaling the refactor across the site.

## What Changes

- Add explicit workspace task orchestration so web, docs, Storybook, shared UI, and token consumers rebuild from shared package changes.
- Introduce `packages/tokens` as the distribution boundary for generated design-token CSS from root `design.tokens.json`.
- Introduce `packages/ui` with a small data-agnostic component slice and a `cn` utility backed by `clsx` and `tailwind-merge`.
- Refactor one resume UI slice to consume shared UI while preserving the existing visual output and semantic Tailwind authoring model.
- Add a Storybook workbench for the shared UI slice with docs, controls, accessibility addon, MSW infrastructure, and local-only Storybook MCP support.
- Add a docs app for design-system documentation and design-system-only LLM routes.
- Add noindex behavior for Storybook and indexable behavior for docs.
- Add verification commands for token distribution, Storybook build, docs build, and docs LLM smoke checks.

## Capabilities

### New Capabilities
- `design-token-distribution`: Shared token package distribution, token build orchestration, and consumer verification.
- `shared-ui-vertical-slice`: Shared UI package rules, component extraction boundaries, and web integration for the first slice.
- `design-system-storybook`: Storybook workbench behavior, static build, accessibility posture, MSW infrastructure, and local-only MCP addon behavior.
- `design-system-docs`: Fumadocs-backed design-system documentation, Markdown routes, docs LLM outputs, and profile LLM separation.
- `design-system-deployment`: Docs indexing, Storybook noindex behavior, and Vercel rebuild expectations for shared package changes.

### Modified Capabilities
- `design-system`: Token CSS is no longer consumed directly from `apps/web`; generated CSS is distributed through `packages/tokens`.
- `website-delivery`: Portfolio LLM/profile delivery remains separate from the design-system docs LLM surface.

## Impact

- Adds workspace apps under `apps/docs` and `apps/storybook`.
- Adds workspace packages under `packages/tokens` and `packages/ui`.
- Adds Turborepo task orchestration and package scripts.
- Adds Storybook, Fumadocs, shared UI utility dependencies, and related build/test scripts.
- Updates the web app to consume shared token CSS and the shared UI slice.
- Adds docs/static Storybook deployment policy files and smoke checks.
