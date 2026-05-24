## 1. Spec First

- [x] 1.1 Create the `design-system-public-slice` OpenSpec change.
- [x] 1.2 Add proposal, design, capability specs, and tasks for the vertical slice.
- [x] 1.3 Validate the OpenSpec change in strict mode before implementation.

## 2. Token Distribution And Orchestration

- [x] 2.1 Add Turborepo configuration and root scripts for web, docs, Storybook, and shared package tasks.
- [x] 2.2 Add `packages/tokens` as the generated CSS distribution package.
- [x] 2.3 Update the token generator and checks to write/read `packages/tokens/css/tokens.generated.css`.
- [x] 2.4 Update web styles to import shared token CSS.
- [x] 2.5 Add a token distribution smoke check.

## 3. Shared UI Vertical Slice

- [x] 3.1 Add `packages/ui` with TypeScript, package exports, `cn`, and shared stylesheet entry.
- [x] 3.2 Extract the section header slice into `@mun.digital/ui`.
- [x] 3.3 Update the web resume section header wrapper to consume shared UI.
- [x] 3.4 Verify the slice avoids data ownership, raw token literals, Fumadocs typography, and premature CVA.

## 4. Storybook Workbench

- [x] 4.1 Add `apps/storybook` with `@storybook/nextjs-vite`.
- [x] 4.2 Add stories for the shared section header states and docs/controls metadata.
- [x] 4.3 Configure accessibility addon in warning/todo posture.
- [x] 4.4 Add local-only Storybook MCP addon configuration.
- [x] 4.5 Add MSW infrastructure with empty handlers for the static slice.
- [x] 4.6 Add Storybook static noindex assets/config.

## 5. Docs And LLM Support

- [x] 5.1 Add `apps/docs` with Fumadocs dependencies/config and a Next docs app.
- [x] 5.2 Add docs content for tokens, shared UI usage, architecture, Storybook, and agent workflow.
- [x] 5.3 Add per-page Markdown routes and page Markdown actions.
- [x] 5.4 Add docs-only `llms.txt` and `llms-full.txt` routes.
- [x] 5.5 Add docs robots policy that allows indexing.
- [x] 5.6 Add docs LLM smoke verification.

## 6. Deployment Configuration

- [x] 6.1 Add Vercel project configuration notes/files for docs and Storybook roots.
- [x] 6.2 Ensure Storybook deploy output remains public/noindexed and does not expose MCP runtime.
- [x] 6.3 Ensure shared token/UI changes are visible to web, docs, and Storybook build graphs.
- [x] 6.4 Update deployment spec with separate Vercel project settings, include-outside-root requirements, and `turbo-ignore` ignored build steps.
- [x] 6.5 Update Storybook robots policy to allow crawling while preserving `X-Robots-Tag: noindex, nofollow`.
- [x] 6.6 Add the bounded cross-agent planning review workflow to AGENTS.md.

## 7. Verification

- [x] 7.1 Run `pnpm design:build`.
- [x] 7.2 Run `pnpm design:check`.
- [x] 7.3 Run strict OpenSpec validation for this change.
- [x] 7.4 Run `pnpm run lint`.
- [x] 7.5 Run `pnpm run build`.
- [x] 7.6 Run `pnpm run docs:build`.
- [x] 7.7 Run `pnpm run docs:llms:smoke`.
- [x] 7.8 Run `pnpm run storybook:build`.
- [x] 7.9 Run `pnpm run storybook:a11y`.
- [x] 7.10 Run unchanged existing smoke checks where relevant.
