## Why

The homepage Reading rail is backed by the generated public Raindrop snapshot, but the snapshot currently omits safe thumbnail data that already exists in private Raindrop items. Adding optional sanitized thumbnails improves the Reading rail without introducing live Raindrop API access into the public website, CLI, MCP, or package runtime.

## What Changes

- Bump the public `raindrops.json` schema version to `1.1.0`.
- Add optional `thumbnailUrl` to public link objects, derived from safe `cover` first and then the first safe `media[].link`.
- Continue omitting raw private Raindrop fields, including `note`, `user`, `creatorRef`, `cache`, `file`, `cover`, `media`, and collection ids.
- Render decorative lazy thumbnails in the homepage Reading rail only when `thumbnailUrl` exists.
- Keep text-only card rendering for links without thumbnails.

## Impact

- Public runtime surfaces continue reading generated artifacts only.
- No live Raindrop fetching is added to the deployed website.
- Existing link fields remain unchanged and thumbnails remain optional.
- CLI, MCP, and package consumers may receive `thumbnailUrl` where they already return full public link objects; this is intentional because the value is sanitized and public.
