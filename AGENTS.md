# mundigital

Canonical operations doc for any agent (Claude, Codex, etc.) opened in this directory. Read this first.

<!-- BEGIN:nextjs-agent-rules -->
## Next.js 16 — read before writing Next-specific code
This version has breaking changes — APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Brief
- Purpose: TBD — placeholder personal site at mun.digital; specific concept to be defined.
- Canonical domain: https://mun.digital
- Repository: https://github.com/mundizzle/mun.digital
- Deployment: Vercel personal account `mundigital`, project `mun-digital` (Vercel slug uses hyphen — dots aren't allowed in project slugs)

## Current State
- Last verified: 2026-04-30 (America/Los_Angeles)
- Local scaffold: complete (Next.js 16.2.4, React 19.2.4, Tailwind 4, TypeScript 5, ESLint 9)
- GitHub: pushed → https://github.com/mundizzle/mun.digital
- Vercel deployment: linked + Git auto-deploy verified. Current production alias: https://mundigital.vercel.app (sticky from pre-rename; will be replaced by https://mun.digital once DNS is live)
- Custom domain: `mun.digital` and `www.mun.digital` added to Vercel project; **DNS NOT YET POINTING** — user action required
- Placeholder homepage: replaced

## Operating Rules
- Package manager: npm
- Node version: pinned to major line `24.x` in `package.json` `engines.node`; `.nvmrc` mirrors major (`24`) for local tooling. Do NOT pin a full patch in `engines.node` — Vercel selects by major line only.
- Framework: Next.js App Router + TypeScript + Tailwind.
- Secrets: Vercel env vars only; never commit `.env*.local`.
- Every agent updates "Current State" + "Status Checklist" before ending its turn.

## Commands
```bash
npm install
npm run dev      # localhost:3000
npm run lint
npm run build
```

## Deployment
- Production branch: `main`
- Production URL: https://mun.digital (once DNS is live)
- Preview deployments: Vercel Git integration on PR/branch pushes
- Manual deploy fallback: `vercel --prod` (deploys under the authenticated personal account; no `--scope` needed)

## DNS
Authoritative DNS is **Namecheap BasicDNS** (`dns1.registrar-servers.com` / `dns2.registrar-servers.com`). Records are managed at Namecheap → Domain List → `mun.digital` → Advanced DNS.

Vercel's recommended records (from `vercel domains inspect`):

| Host | Type  | Value                  | Verified |
| ---- | ----- | ---------------------- | -------- |
| @    | A     | 76.76.21.21            | no       |
| www  | A     | 76.76.21.21            | no       |

Note: Vercel recommended an A record (not CNAME) for `www` in this project. Use what `vercel domains inspect www.mun.digital` prints; do not assume CNAME.

Alternative: change nameservers to `ns1.vercel-dns.com` / `ns2.vercel-dns.com` and let Vercel manage records directly. Not recommended unless user wants Vercel as DNS provider.

Conflicts to remove at Namecheap before adding records:
- "Redirect Domain" entry sending `mun.digital → http://www.mun.digital/` (must be deleted)
- Any existing `A`/`AAAA`/`ALIAS`/`CNAME` records on `@` or `www`
- Any `CAA` records that don't include `letsencrypt.org` (or remove all CAA records)

## Status Checklist
- [x] Next.js scaffolded locally
- [x] Node version pinned (24.x in engines.node, 24 in .nvmrc)
- [x] lint + build pass locally
- [x] git initialized, initial commits landed
- [x] GitHub repo created and pushed
- [x] Vercel project linked
- [x] GitHub auto-deploy verified by placeholder homepage commit
- [x] Default Next homepage replaced with minimal placeholder
- [x] Custom domains (`mun.digital`, `www.mun.digital`) added in Vercel
- [ ] Namecheap: redirect-domain entry removed; A records added for `@` and `www`
- [ ] TLS issued; apex loads; www → apex redirect verified

## Next Actions
1. **User** removes the existing redirect at Namecheap (`mun.digital → http://www.mun.digital/`) and adds A records (`@ → 76.76.21.21`, `www → 76.76.21.21`) in Advanced DNS.
2. After DNS propagates (~2–10 min): dig + curl + `vercel domains inspect` to verify TLS, apex load, and www→apex redirect.
3. Flip the last two checklist items, fill DNS table Verified=yes, push final commit.

## Decision Log
- 2026-04-30: Chose Next.js + TypeScript + Tailwind + App Router scaffold.
- 2026-04-30: Chose public GitHub repo.
- 2026-04-30: Deferred LICENSE selection (none for now); revisit when site purpose is decided.
- 2026-04-30: Chose apex `mun.digital` as canonical despite Vercel's general guidance to use `www` as primary.
- 2026-04-30: No GitHub branch protection initially; revisit once site has meaningful content or collaborators.
- 2026-04-30: Vercel deployments run under the personal account (`mundigital`); no team scope.
- 2026-04-30: Node pinned to major line `24.x` via `engines.node`; `.nvmrc` mirrors major (`24`).
- 2026-04-30: 2 moderate npm audit vulnerabilities reported on fresh scaffold; not blocking. Track in Next Actions later.
