## 1. OpenSpec And Review

- [x] 1.1 Validate the OpenSpec change with strict spec validation.
- [x] 1.2 Send the OpenSpec change to Claude for cross-agent review.
- [x] 1.3 Incorporate required Claude review changes before implementation.

## 2. Token Distribution

- [x] 2.1 Extend the token build script to generate Storybook-compatible CSS annotations and static metadata.
- [x] 2.2 Export `@mun.digital/tokens/metadata` from the tokens package.
- [x] 2.3 Extend `design:check` and `tokens:smoke` to fail on stale or incomplete metadata.
- [x] 2.4 Regenerate committed token CSS and metadata.

## 3. Storybook Configuration

- [x] 3.1 Defer `storybook-design-token` addon registration and keep token references metadata-rendered because the addon is not OKLCH-safe.
- [x] 3.2 Add shared mun.digital Storybook theme configuration for manager chrome and Docs.
- [x] 3.3 Replace the placeholder a11y script with a self-contained Storybook build/serve/test-runner based a11y check.
- [x] 3.4 Add a Storybook component test script using the Storybook Vitest addon.

## 4. SectionHeader Storybook Slice

- [x] 4.1 Expand `SectionHeader` stories with Docs descriptions, explicit argTypes, useful controls, and representative examples.
- [x] 4.2 Add interaction assertions for the checked stories.
- [x] 4.3 Verify `SectionHeader` has zero a11y violations and keep the checked path in hard-error mode.

## 5. Docs Expansion

- [x] 5.1 Replace the custom docs renderer with a vetted Markdown renderer and remove unused Fumadocs wiring.
- [x] 5.2 Expand token docs with semantic usage and generated token reference.
- [x] 5.3 Expand component docs with the `SectionHeader` API and examples.
- [x] 5.4 Expand Storybook docs with Docs, Controls, props tables, token addon, tests, a11y, and local-only MCP boundaries.
- [x] 5.5 Expand agent workflow docs with OpenSpec, Claude review, implementation, and verification.
- [x] 5.6 Confirm docs route handlers remain static-safe and canonical metadata remains page-specific.

## 6. Verification

- [x] 6.1 Run OpenSpec strict validation.
- [x] 6.2 Run token checks: `pnpm run design:check` and `pnpm run tokens:smoke`.
- [x] 6.3 Run repo/docs checks: `pnpm run lint`, `pnpm run build`, `pnpm run docs:build`, and `pnpm run docs:llms:smoke`.
- [x] 6.4 Run Storybook checks: `pnpm run storybook:build`, Storybook component tests, and `pnpm run storybook:a11y`.
- [x] 6.5 Run foundation smokes: `pnpm run public:smoke`, `pnpm run llms:smoke`, `pnpm run profile:smoke`, `pnpm run mcp:smoke`, and `pnpm run pack:smoke`.
- [x] 6.6 Browser-verify docs pages, Storybook theme, metadata token reference, token addon panel/docs block when active, `SectionHeader` Controls, test panel, and a11y panel.
