## 1. Plan And Review

- [x] 1.1 Validate the OpenSpec change with strict spec validation.
- [x] 1.2 Send the plan to Claude for cross-agent review.
- [x] 1.3 Incorporate required Claude feedback before implementation.

## 2. Docs Information Architecture

- [x] 2.1 Add CLI and MCP docs content pages.
- [x] 2.2 Add static Markdown route handlers for CLI and MCP pages.
- [x] 2.3 Update docs page registry, homepage copy, and docs LLM text for the broader public reference surface.
- [x] 2.4 Update component, Storybook, architecture, and agent workflow docs to reflect the docs/manual vs. Storybook/workbench split.
- [x] 2.5 De-emphasize Raindrop/bookmarks by keeping public-link docs secondary under CLI/MCP.
- [x] 2.6 Extend docs LLM smoke coverage so CLI/MCP docs enumerate current public commands, tools, resource, and prompt.

## 3. Verification

- [x] 3.1 Run OpenSpec strict validation.
- [x] 3.2 Run docs checks: `pnpm run docs:build` and `pnpm run docs:llms:smoke`, including CLI/MCP drift assertions.
- [x] 3.3 Run public interface smokes: `pnpm run profile:smoke`, `pnpm run mcp:smoke`, `pnpm run mcp:http:smoke http://localhost:3000/api/mcp`, and `pnpm run pack:smoke`.
- [x] 3.4 Browser-verify docs navigation, CLI page, MCP page, Markdown routes, and docs LLM content.
