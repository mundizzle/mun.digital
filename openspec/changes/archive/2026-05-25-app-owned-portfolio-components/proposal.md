## Why

The current docs and Storybook slice over-corrected toward a reusable UI package. `mun.digital` is a portfolio app with public agentic surfaces, not a component library. The component ownership model should keep portfolio UI in `apps/web`, keep shared tokens in `packages/tokens`, and make docs emphasize the public CLI and MCP contracts.

This change supersedes the unarchived docs/storybook direction that treated `packages/ui` as the primary component boundary.

## What Changes

- Retire `packages/ui` and keep portfolio components app-owned under `apps/web`.
- Move `cn` to `apps/web/src/lib/cn.ts` and make `clsx` and `tailwind-merge` direct web app dependencies.
- Keep `@mun.digital/tokens` as the shared design source.
- Change Storybook to load stories from `apps/web` and organize them as `Design/Tokens`, `Components/...`, and `Templates/...`.
- Move design-token documentation into a dedicated Storybook token story backed by `@mun.digital/tokens/metadata`.
- Pivot docs homepage, navigation emphasis, docs LLM output, and support pages toward CLI and MCP while preserving existing Markdown routes.
- Add an app unit-test harness for real portfolio logic and keep presentational component verification in Storybook.

## Impact

- Affected apps/packages: `apps/web`, `apps/storybook`, `apps/docs`, `packages/ui`, OpenSpec docs.
- Public package interface: removes the private workspace `@mun.digital/ui` package; no public npm package is removed.
- Verification: OpenSpec validation, lint/build, docs build and LLM smoke, Storybook build/play tests/a11y, app unit tests, and relevant public/profile/MCP smokes.
