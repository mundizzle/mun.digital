## Approach

- Keep this as app-local maintenance, not a reusable design-system extraction.
- Prefer Tailwind utilities over new custom classes for framed surfaces.
- Treat the MCP endpoint as a machine endpoint: display `https://mun.digital/api/mcp`, but link browser users to MCP docs.
- Keep the current lightweight `TenPrint` canvas backdrop; do not port the retired C64 branch.
- Preserve accessibility by ensuring the homepage still has a valid `h1` even after removing the visible hero title.

## Best-Practices Review Targets

- Next.js: App Router conventions, `next/image` usage, metadata/route behavior, and no deprecated middleware usage.
- React: client component boundaries, effect cleanup, stable rendering, and avoiding avoidable hydration churn.
- Tailwind/CSS: standard utilities, responsive layout stability, focus-visible states, reduced-motion behavior, and avoiding over-broad custom CSS.

## Verification

- Validate OpenSpec before and after archival.
- Run unit, lint, build, and public smoke checks.
- Browser-verify homepage, work, writing, and resume surfaces at desktop and mobile widths.
- Require Claude review for the PR.
