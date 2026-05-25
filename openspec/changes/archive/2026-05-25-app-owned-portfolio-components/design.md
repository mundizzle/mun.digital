## Context

The repo now has three public surfaces:

- Portfolio app at `apps/web`.
- Agent and developer docs at `apps/docs`.
- Storybook workbench at `apps/storybook`.

Only design tokens are shared across those surfaces. Portfolio components are app implementation details unless a separate product need emerges.

Claude review from the previous planning pass agreed with this direction. Open UI remains useful as a component anatomy, state, behavior, accessibility, and testing reference, but it is not a reason to create a local reusable UI package.

## Decisions

1. App owns portfolio components.

   `SectionHeader`, chrome helpers, page templates, and portfolio-specific components live in `apps/web`. This keeps ownership aligned with the only consumer and avoids maintaining a package API for a single app.

2. Tokens remain shared.

   `@mun.digital/tokens/css` and `@mun.digital/tokens/metadata` stay the cross-app design contract. Storybook and docs continue to render token references from generated metadata.

3. Storybook sources app stories.

   Storybook documents and tests app components through stories colocated under `apps/web`. It should not import route `page.tsx` files; templates use fixtures so they stay deterministic and safe.

4. Docs emphasize agentic surfaces.

   The docs app keeps component, token, and Storybook pages as stable supporting URLs, but primary editorial emphasis moves to MCP and CLI because those are the durable public agent interfaces.

5. Presentational components are tested through Storybook.

   Component stories cover variants and states, `play` functions assert interactive or stateful behavior, and the Storybook a11y path checks selected stories. App unit tests are reserved for real logic such as resume adaptation.

## Risks / Trade-offs

- Removing `packages/ui` reduces theoretical reuse. That is intentional because there is no second consumer today.
- Storybook imports from `apps/web`, so the Storybook Vite config must resolve the web app alias and include web source files in Tailwind scanning.
- Docs smoke checks need to stop requiring “Shared UI” as a primary docs concept and instead assert CLI/MCP prominence.

## Migration Plan

1. Add this OpenSpec change and update active spec text to the corrected ownership model.
2. Move `cn` and `SectionHeader` into `apps/web`.
3. Remove `@mun.digital/ui` package references and delete the package source.
4. Move Storybook stories into `apps/web` and add token/component/template coverage.
5. Pivot docs copy, nav order, LLM output, and smoke checks toward CLI/MCP while preserving Markdown routes.
6. Add app unit-test harness for resume adaptation logic.
7. Run the verification set for changed surfaces.
