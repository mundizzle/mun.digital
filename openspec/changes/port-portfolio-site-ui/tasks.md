## 1. Plan And Review

- [x] 1.1 Create the OpenSpec change artifacts and website-delivery spec delta.
- [x] 1.2 Validate the OpenSpec change with strict validation.
- [x] 1.3 Record the cross-agent consensus and owner correction in the design notes.

## 2. UI Port

- [x] 2.1 Add temporary typed UI fixture content in `apps/web/src/content/portfolio.ts`.
- [x] 2.2 Add site chrome and shared page frame components.
- [x] 2.3 Move the current resume page to `/resume`.
- [x] 2.4 Replace `/` with the landing page and landing components.
- [x] 2.5 Add `/work` and `/work/[id]` fixture-backed routes.
- [x] 2.6 Add `/writing` and `/writing/[id]` fixture-backed routes.
- [x] 2.7 Add route metadata and update sitemap.

## 3. Verification

- [x] 3.1 Run OpenSpec strict validation.
- [x] 3.2 Run `pnpm run lint`.
- [x] 3.3 Run `pnpm run build`.
- [x] 3.4 Run public surface smoke checks: `pnpm run llms:smoke`, `pnpm run profile:smoke`, `pnpm run mcp:smoke`, `pnpm run mcp:http:smoke http://localhost:3000/api/mcp`, and `pnpm run public:smoke`.
- [x] 3.5 Browser-verify `/`, `/resume`, `/work`, `/work/[id]`, `/writing`, and `/writing/[id]` at desktop and mobile sizes, including reduced-motion behavior and `/` Markdown negotiation.
