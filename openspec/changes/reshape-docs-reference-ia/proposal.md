## Why

The docs app currently reads as a design-system-only reference, but the public surface now includes reusable UI, generated tokens, the `mundigital` CLI, and the `mundigital` MCP server. This change reshapes docs and Storybook so docs become the public reference/manual while Storybook remains the interactive component and design-system workbench.

## What Changes

- Reorganize docs information architecture around `Components`, `Tokens`, `CLI`, `MCP`, `Storybook`, and `Agent Workflow`.
- Add docs pages and Markdown routes for CLI and MCP usage.
- Update docs LLM output to describe the broader public reference surface while keeping profile/resume facts on `mun.digital/llms.txt`.
- De-emphasize Raindrop/bookmark material by documenting link commands/tools as secondary CLI/MCP capabilities, not a main docs section.
- Update Storybook docs so it describes Storybook as the high-level design-system workbench and component catalog for `packages/ui`.
- Keep Storybook focused on components and visual/test evidence, not CLI/MCP manuals.
- Preserve public-data boundaries: docs and Storybook must not expose private resume/profile data.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `design-system-docs`: broaden docs from design-system-only to public reference documentation for UI components, tokens, CLI, MCP, Storybook, and agent workflow.
- `design-system-storybook`: clarify Storybook as a component catalog and high-level design-system workbench for `packages/ui`.
- `cli-profile`: add public docs expectations for CLI command documentation.
- `mcp-profile`: add public docs expectations for MCP transport, resources, tools, and local/static boundaries.

## Impact

- Affected app: `apps/docs`.
- Affected docs/content: docs navigation, LLM text, Markdown route handlers, CLI/MCP docs pages, Storybook docs page.
- Affected specs: docs, Storybook, CLI, MCP.
- No runtime CLI or MCP behavior changes are intended.
- Verification: OpenSpec strict validation, docs build, docs LLM smoke, CLI/profile/MCP/package smoke checks, and targeted browser/content verification.
