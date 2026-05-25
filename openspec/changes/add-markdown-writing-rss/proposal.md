## Why

The portfolio writing surface is still backed by temporary UI-port fixtures, which makes simple article authoring and feed discovery impossible without editing TypeScript data. Moving writing to local Markdown keeps the public route lightweight while making RSS a first-class discovery surface.

## What Changes

- Replace fixture-backed `/writing` content with local Markdown files under `apps/web/content/writing/*.md`.
- Require only `title` and quoted `YYYY-MM-DD` `date` frontmatter; derive slug, teaser text, rendered HTML, and RSS entries from the Markdown file.
- Keep public routes as `/writing` and `/writing/[id]`; do not add `/blog`.
- Add `/rss.xml` with absolute writing links, RFC-822 dates, `atom:link`, and `content:encoded`.
- Advertise RSS through root metadata, footer navigation, and `/sitemap.xml`.
- Remove writing fixture fields for tags, read time, excerpt, structured body, and the tools-mentioned footer.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `website-delivery`: writing routes move from temporary fixtures to static Markdown files, and metadata discovery adds an RSS feed.

## Impact

- Affected code: `apps/web/src/content/portfolio.ts`, writing routes/components, landing teaser, sitemap, root metadata, footer, and new RSS route/Markdown loader.
- New dependencies: `gray-matter`, `remark`, and `remark-html` in the web app.
- Verification: add focused loader unit tests and RSS/public smoke coverage, then run unit tests, lint, build, and relevant public smoke checks.
