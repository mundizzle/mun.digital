## 1. Implementation

- [x] 1.1 Add Markdown/RSS dependencies to the web app.
- [x] 1.2 Add local Markdown writing posts with minimal `title` and `date` frontmatter.
- [x] 1.3 Add a server-only writing loader that validates posts, derives slugs/descriptions, sorts newest-first, and renders Markdown HTML.
- [x] 1.4 Update landing, writing index, and writing detail routes/components to use Markdown-backed posts and remove fixture-only metadata.
- [x] 1.5 Add static `/rss.xml` generation with absolute links, RFC-822 dates, Atom self link, and `content:encoded`.
- [x] 1.6 Add RSS discovery through root metadata, footer link, and sitemap entries.

## 2. Verification

- [x] 2.1 Add unit tests for loader parsing, slug derivation, sorting, first paragraph extraction, and malformed frontmatter rejection.
- [x] 2.2 Add or extend RSS smoke coverage for content type, well-formed XML, item count, absolute links, RFC-822 dates, root alternate link, and footer href.
- [x] 2.3 Run `pnpm run test:unit`.
- [x] 2.4 Run `pnpm run lint`.
- [x] 2.5 Run `pnpm run build`.
- [x] 2.6 Run relevant public smoke checks.
