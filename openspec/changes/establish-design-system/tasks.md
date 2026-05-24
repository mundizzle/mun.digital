## 1. Spec First

- [x] 1.1 Create the `establish-design-system` OpenSpec change.
- [x] 1.2 Add the design-system proposal, design, tasks, and spec.
- [x] 1.3 Add the durable AGENTS.md spec-first workflow rule.
- [x] 1.4 Validate the OpenSpec change in strict mode.
- [x] 1.5 Ask Claude to review the OpenSpec change before implementation.
- [x] 1.6 Address accepted spec-review feedback before implementation.

## 2. Design Source Files

- [ ] 2.1 Add root `DESIGN.md` following the DESIGN.md format and current site design.
- [ ] 2.2 Add root `design.tokens.json` using DTCG 2025.10 structured token values.
- [ ] 2.3 Include primitive color tokens and `semantic.light.*` / `semantic.dark.*` groups.
- [ ] 2.4 Document components.build extensions and the old-to-new semantic mapping.

## 3. Generated CSS Pipeline

- [ ] 3.1 Add `scripts/build-design-tokens.mjs`.
- [ ] 3.2 Generate committed `apps/web/src/app/tokens.generated.css`.
- [ ] 3.3 Add `design:build` and `design:check` scripts.
- [ ] 3.4 Ensure `design:check` fails when generated CSS is stale.
- [ ] 3.5 Ensure generated CSS values are equivalent to the current light and dark token values.

## 4. Web Styling Integration

- [ ] 4.1 Import `tokens.generated.css` immediately after `@import "tailwindcss";`.
- [ ] 4.2 Update `@theme inline` to expose the extended components.build semantic utilities.
- [ ] 4.3 Rename existing color utility usages to the new semantic names without markup or layout changes.
- [ ] 4.4 Install and register `@tailwindcss/typography` without adding a custom prose theme.
- [ ] 4.5 Preserve `prefers-color-scheme` dark mode and print behavior.

## 5. Verify And Review

- [ ] 5.1 Run `pnpm design:build`.
- [ ] 5.2 Run `pnpm design:check`.
- [ ] 5.3 Run `pnpm dlx @fission-ai/openspec@latest validate establish-design-system --strict`.
- [ ] 5.4 Run `pnpm run lint`.
- [ ] 5.5 Run `pnpm run build`.
- [ ] 5.6 Manually check light, dark, and print rendering.
- [ ] 5.7 Ask Claude to review PR implementation for spec conformance.
- [ ] 5.8 Archive the OpenSpec change as the final commit after review consensus.
