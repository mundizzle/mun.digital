## Context

The current portfolio site uses Tailwind 4 CSS-first configuration in `apps/web/src/app/globals.css`. Current tokens are raw CSS variables (`--bg`, `--surface`, `--ink`, `--ink-dim`, `--ink-faint`, `--rule`, `--rule-strong`, `--accent`, `--accent-soft`, `--grid`, and `--rail-*`) mapped through `@theme inline` to semantic utilities. Dark mode is automatic through `prefers-color-scheme`.

The next UI phase will follow components.build conventions, so this phase establishes a design system foundation that is faithful to the current UI while moving token values into a machine-readable source of truth.

## Goals / Non-Goals

**Goals:**
- Make `design.tokens.json` the machine-readable source of truth for design token values.
- Add `DESIGN.md` as the human and agent-readable source of design intent.
- Generate committed CSS semantic token values from `design.tokens.json`.
- Preserve current light, dark, and print behavior.
- Move existing color utility usage to components.build-style semantic names while preserving the current richer palette levels.
- Add a spec-first workflow rule to `AGENTS.md` for future foundation-level changes.

**Non-Goals:**
- Do not redesign the visual language.
- Do not normalize the current spacing or typography scale.
- Do not add a dark-mode toggle or `.dark` class dependency.
- Do not add `clsx`, `tailwind-merge`, `cn()`, or component variant APIs.
- Do not add a custom prose theme until a rendered prose surface exists.
- Do not introduce a separate design-tokens package.

## Decisions

- **Use `DESIGN.md` at repo root.** This matches existing top-level convention and avoids case ambiguity on macOS.
- **Use `design.tokens.json` at repo root.** There is one design token source and one current consumer; a package or folder can be introduced when a second consumer or token build pipeline warrants it.
- **Use DTCG structured token values.** Color tokens use structured OKLCH `$value` objects with `colorSpace`, `components`, and optional `alpha`; CSS strings are generated output only.
- **Represent modes as semantic groups.** DTCG 2025.10 does not standardize modes, so `semantic.light.*` and `semantic.dark.*` are local groups that reference shared primitive token leaves.
- **Generate a CSS partial.** `scripts/build-design-tokens.mjs` writes `apps/web/src/app/tokens.generated.css`; `globals.css` imports it immediately after Tailwind.
- **Keep `@theme inline` hand-authored.** Token values are generated, but the Tailwind utility namespace remains a reviewable CSS surface.
- **Extend components.build naming.** Use `background`, `card`, `foreground`, `muted-foreground`, `subtle-foreground`, `border`, `border-strong`, `primary`, and `primary-soft` so current design nuance is not collapsed.
- **Register Tailwind Typography only.** The plugin is installed and registered, but custom prose token mapping waits for a real rendered prose UI.

## Risks / Trade-offs

- **Token/CSS drift** -> `design:check` regenerates to a temp file and fails when committed `tokens.generated.css` is stale.
- **DTCG non-conformance** -> the generator validates structured color objects and same-type alias references before writing CSS.
- **Visual regressions from utility renames** -> generated values must be value-equivalent to the current CSS values, and light, dark, and print behavior must be checked.
- **components.build naming mismatch** -> extensions are documented in `DESIGN.md` instead of collapsing existing text and border levels.
- **Spec drift during implementation** -> implementation changes that contradict the spec update the OpenSpec change before code continues.
