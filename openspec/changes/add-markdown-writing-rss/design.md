## Overview

The writing surface becomes a static, repo-authored Markdown system. Files in `apps/web/content/writing` are the source of truth for public article pages and RSS items. The web app reads those files at build time, validates minimal frontmatter, renders Markdown to HTML, and exposes the same content through `/writing`, `/writing/[id]`, `/rss.xml`, sitemap metadata, and the landing-page writing teaser.

## Data Model

Each post file requires only:

- `title`: non-empty string
- `date`: string matching `YYYY-MM-DD`

Derived fields:

- `id`: filename without `.md`
- `url`: `https://mun.digital/writing/${id}` where needed by feeds/sitemap
- `description`: first Markdown paragraph as plain text
- `html`: rendered Markdown body

Malformed frontmatter or content should throw during loading so `next build` and unit tests fail loudly.

## Routing

`/writing` lists posts newest-first and displays title plus date. `/writing/[id]` is statically generated with `generateStaticParams`, `dynamicParams = false`, and `dynamic = "force-static"`. Missing slugs resolve to `notFound()`.

`/rss.xml` is a static route handler that returns RSS XML with `application/rss+xml; charset=utf-8`. It includes channel metadata, an Atom self link, one item per post, absolute links, RFC-822 `pubDate`, a plain-text description, and `content:encoded` for rendered HTML.

## Rendering

Markdown rendering uses `remark` and `remark-html`. Content is trusted repo-authored Markdown, so the first implementation does not add MDX, components, comments, categories, search, read time, or tools metadata. React renders article HTML with `dangerouslySetInnerHTML` only from this server-side loader.

## Discovery

Root metadata includes the RSS alternate link. The footer visible RSS link points to `/rss.xml`. The sitemap includes `/rss.xml` and all Markdown-backed writing posts.

## Risks

- RSS XML must escape text fields while preserving rendered HTML in CDATA for `content:encoded`.
- Loader tests need a temporary content directory path so validation cases do not mutate real posts.
- File-system reads must stay server-only and out of client components.

## Verification

- Unit-test parsing, slug derivation, sorting, first-paragraph extraction, and invalid frontmatter rejection.
- Smoke-test `/rss.xml` content type, well-formed XML, item count, absolute links, RFC-822 dates, root alternate link, and footer RSS href.
- Run `pnpm run test:unit`, `pnpm run lint`, `pnpm run build`, and relevant public smoke checks.
