## 1. OpenSpec

- [x] 1.1 Add superseding OpenSpec artifacts for app-owned portfolio components.
- [x] 1.2 Update current specs away from `packages/ui` as a reusable component boundary.
- [x] 1.3 Validate OpenSpec strictly.

## 2. Web App Ownership

- [x] 2.1 Move `cn` to `apps/web/src/lib/cn.ts` and add direct web dependencies.
- [x] 2.2 Collapse `SectionHeader` into `apps/web` and remove the package wrapper.
- [x] 2.3 Remove `@mun.digital/ui` from web imports and Next transpilation.
- [x] 2.4 Add an app unit-test harness seeded with resume adaptation logic.

## 3. Storybook

- [x] 3.1 Change Storybook story sources and Tailwind scanning to `apps/web`.
- [x] 3.2 Add `Design/Tokens` story from `@mun.digital/tokens/metadata`.
- [x] 3.3 Add representative app component and template stories using fixtures.
- [x] 3.4 Keep Storybook play/a11y as the presentational component verification surface.

## 4. Docs

- [x] 4.1 Pivot docs registry, homepage, metadata, and LLM text toward MCP and CLI.
- [x] 4.2 Demote component/token/Storybook docs to supporting pointer pages while preserving Markdown routes.
- [x] 4.3 Update docs LLM smoke assertions for the agentic-docs focus.

## 5. Package Cleanup

- [x] 5.1 Remove `packages/ui` source and workspace references.
- [x] 5.2 Refresh the pnpm lockfile.

## 6. Verification

- [x] 6.1 Run lint, build, docs build, docs LLM smoke, and web unit tests.
- [x] 6.2 Run Storybook build, Storybook Vitest/play tests, and Storybook a11y.
- [x] 6.3 Run relevant public/profile/MCP smoke checks.
