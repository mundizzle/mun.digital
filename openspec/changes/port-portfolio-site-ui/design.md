## Overview

Port the finalized Claude Design portfolio UI into the Next.js 16 App Router app as a visual-only first phase. The implementation translates the design output into repo-native TypeScript, Server Components by default, token-backed Tailwind utilities, and a small set of client leaves for interactive visual details.

Design source:
- Bundle URL: `https://api.anthropic.com/v1/design/h/UtT93Iz7nyx1Fa5KSp7pLg`
- Extracted local reference: `/tmp/mun-design-extract/mun-digital-design-system/project/ui_kits/portfolio_site/`
- Reference files: `index.html`, `styles.css`, `content.js`, `Chrome.jsx`, `LandingPage.jsx`, `ResumePage.jsx`, `WorkPage.jsx`, `BlogPage.jsx`

The extracted path is ephemeral and must not be committed as prototype code.

## Route Model

- `/`: landing page, 1180px max frame.
- `/resume`: current resume page, 860px max frame, real profile data.
- `/work`: fixture-backed work index.
- `/work/[id]`: fixture-backed case study detail.
- `/writing`: fixture-backed writing index.
- `/writing/[id]`: fixture-backed post detail.
- Bookmarks have no route in this phase; they render only as a landing reading rail.

## Content Boundary

`apps/web/src/content/portfolio.ts` holds temporary UI-port fixtures for `work`, `posts`, `bookmarks`, `heroRoles`, `surfaces`, and small landing copy. The file header must state that it is visual fixture content only.

The fixtures must not be written into:
- `apps/web/public/raindrops.json`
- `packages/profile/public/`
- `packages/cli/profile/public/`
- `packages/profile/data/resume.json`

The resume route continues to use `loadResume()` and `adaptResume()` from `@mun.digital/profile`.

## App Router Strategy

Pages remain Server Components unless a specific visual interaction requires the client. Client leaves:
- active nav path matching with `usePathname`
- `TypedRotator`
- `TenPrint`
- randomized landing work tiles after mount

The root layout remains a Server Component. Page width is handled explicitly with a shared `PageFrame` wrapper so the landing can use a wide frame without turning layout route-aware on the client.

Detail routes use `generateStaticParams`, `export const dynamicParams = false`, and `notFound()` for unknown fixture ids.

## Visual Strategy

Translate the prototype CSS into Tailwind v4 utilities mapped to existing tokens. Keep `globals.css` additions limited to:
- marquee keyframes
- mask/veil helpers that utilities cannot express clearly
- typed caret and reduced-motion rules

Do not import the prototype `styles.css`.

## Accessibility And Motion

- TenPrint canvas is decorative and `aria-hidden`.
- Reduced motion freezes the typed rotator, TenPrint redraw behavior, and marquee animation into static states.
- Navigation has visible focus and active states.
- Links use real routes instead of hash-routing.

## Cross-Agent Review

Claude and Codex converged on this plan before implementation. The final correction from the owner is that this is a pure UI port, so design-bundle fixture data, including bookmarks, may be used for visual fidelity as long as it remains app-local and does not become generated public artifact data.
