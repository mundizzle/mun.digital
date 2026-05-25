## 1. OpenSpec

- [x] 1.1 Add and validate the thumbnail OpenSpec change.

## 2. Public Snapshot

- [x] 2.1 Update the Raindrop sanitizer to emit optional safe `thumbnailUrl`.
- [x] 2.2 Update public-data and Raindrop smoke checks for schema `1.1.0`, thumbnail safety, and private-field exclusion.
- [x] 2.3 Rebuild mirrored public artifacts.

## 3. Homepage

- [x] 3.1 Add thumbnail data to the Reading rail view model.
- [x] 3.2 Render decorative lazy thumbnails when present and keep text-only cards otherwise.
- [x] 3.3 Add focused unit coverage for thumbnail and text-only Reading cards.

## 4. Verification

- [x] 4.1 Run `pnpm run raindrop:smoke`, `pnpm run public:smoke`, `pnpm run profile:smoke`, `pnpm run mcp:smoke`, `pnpm run pack:smoke`, `pnpm run test:unit`, `pnpm run lint`, and `pnpm run build`.
