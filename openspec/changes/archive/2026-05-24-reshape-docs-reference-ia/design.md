## Context

`packages/ui` is the shared reusable component package. `apps/storybook` demonstrates and tests those components. `packages/cli` publishes the `mundigital` CLI and local stdio MCP server, while `apps/web` exposes the hosted Streamable HTTP MCP route.

The docs app currently has five pages:

- `tokens`
- `components`
- `architecture`
- `storybook`
- `agent-workflow`

The next shape should make docs the broader reference site and reserve Storybook for interactive component/design-system evidence.

## Goals / Non-Goals

**Goals:**

- Make docs navigation and LLM output reflect the public reference/manual role.
- Add CLI and MCP docs without changing CLI/MCP runtime behavior.
- Document link/Raindrop commands as secondary public-link capabilities, not as a headline docs section.
- Make Storybook docs clearly enumerate `packages/ui` components and describe how the site UI is assembled.
- Keep profile facts and private data out of docs and Storybook.

**Non-Goals:**

- No new reusable UI components.
- No CLI command changes.
- No MCP tool/resource changes.
- No Raindrop sync or bookmark feature work.
- No docs framework migration.

## Decisions

1. Keep docs pages flat and explicit.

   The docs app currently has one content file and optional `.md` route per page. Adding `cli.mdx` and `mcp.mdx` keeps the reference site simple, static-safe, and easy to expose in `llms-full.txt`.

2. Use docs for manuals, Storybook for component evidence.

   Docs should explain how to use public interfaces: components, tokens, CLI, MCP, Storybook, and agent workflow. Storybook should demonstrate components from `packages/ui`, show controls/examples/tests, and provide high-level design-system context.

3. Keep Raindrop/bookmarks secondary.

   The CLI and MCP include public link commands/tools backed by sanitized Raindrop output. This change should mention them under CLI/MCP capability tables, but not create a top-level Raindrop docs section.

4. Preserve static-safe Markdown and LLM surfaces.

   New pages need `.md` route handlers with `dynamic = "force-static"` and inclusion in `docPages` so Markdown and LLM outputs stay complete.

## Risks / Trade-offs

- Docs scope can become too broad -> Mitigate with clear page roles and concise command/tool tables.
- CLI/MCP docs can drift from implementation -> Mitigate by grounding docs in current `packages/cli/bin/mundigital.mjs`, `packages/cli/profile/src/mcp-server.mjs`, `cli-profile` spec, and `mcp-profile` spec, then adding docs smoke assertions for the documented commands, tools, resource, and prompt.
- CLI/MCP examples can leak private profile data -> Mitigate by using placeholders or sanitized public artifacts only; never paste raw local profile output into docs examples.
- Link/Raindrop content can become overemphasized -> Mitigate by documenting link commands/tools as secondary rows under CLI/MCP.
- New docs pages can miss static routes -> Mitigate with docs build and docs LLM smoke.

## Migration Plan

1. Update OpenSpec deltas and get Claude review.
2. Add `cli.mdx` and `mcp.mdx`.
3. Add corresponding `.md` static route handlers.
4. Update docs page registry, homepage descriptions, LLM intro, and Storybook/component docs content.
5. Extend docs smoke coverage so CLI/MCP pages enumerate the expected public surfaces.
6. Verify docs build, LLM smoke, and relevant CLI/MCP smoke checks.

Rollback is a branch revert; no production CLI/MCP behavior changes are planned.
