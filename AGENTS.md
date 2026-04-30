# mun.digital

Canonical operations doc for any agent (Claude, Codex, etc.) opened in this directory. Read this first.

<!-- BEGIN:nextjs-agent-rules -->
## Next.js 16 — read before writing Next-specific code
This version has breaking changes — APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Brief
- Purpose: TBD — placeholder personal site at mun.digital; specific concept to be defined.
- Canonical domain: https://mun.digital — **LIVE** with TLS.
- Repository: https://github.com/mundizzle/mun.digital
- Local directory: `/Users/mundizzle/Projects/mun.digital/`
- Deployment: Vercel personal account `mundigital`, project slug `mun-digital` (Vercel disallows dots in slugs)

## Surface inventory (consistency reference)
| Surface | Name |
| --- | --- |
| Domain (canonical) | `mun.digital` |
| Domain (also serves placeholder; should redirect to apex — see Next Actions) | `www.mun.digital` |
| GitHub repo | `mundizzle/mun.digital` |
| Vercel project slug | `mun-digital` |
| Vercel sticky `*.vercel.app` alias | `mundigital.vercel.app` (pre-rename, still active) |
| npm `package.json` name | `mun.digital` |
| Local directory | `~/Projects/mun.digital/` |
| Registrar | Namecheap (BasicDNS nameservers) |

## Current State (as of 2026-04-30, America/Los_Angeles)
- Local scaffold: complete (Next.js 16.2.4, React 19.2.4, Tailwind 4, TypeScript 5, ESLint 9). `npm run lint` and `npm run build` pass.
- Git: pushed to GitHub. `main` is the production branch.
- GitHub: public repo at https://github.com/mundizzle/mun.digital. Description set. No branch protection (intentional).
- Vercel: project `mun-digital` linked; Git integration auto-deploys `main` to production. Verified by a real Git-triggered deploy.
- **Pipeline live:** `https://mun.digital` and `https://www.mun.digital` both return HTTP/2 200 with valid TLS, serving the placeholder. Confirmed via `dig +short` (both resolve to `76.76.21.21`) and `curl -I` (200 from Vercel, `strict-transport-security` set).
- **Caveat:** `www` does NOT 308-redirect to apex; Vercel is serving both with identical content (same etag). For SEO/canonical correctness, configure a redirect via Vercel dashboard → project `mun-digital` → Settings → Domains → `www.mun.digital` → "Redirect to" `mun.digital`. Captured in Next Actions.
- Placeholder homepage: in place at `src/app/page.tsx` with title/description set in `src/app/layout.tsx`. No real site content yet.

## Operating Rules
- Package manager: npm.
- Node: pinned to major line `24.x` in `package.json` `engines.node`; `.nvmrc` mirrors `24` for local tooling. Do NOT pin a full patch in `engines.node` — Vercel selects by major line only.
- Framework: Next.js App Router + TypeScript + Tailwind.
- Secrets: Vercel env vars only; never commit `.env*.local`.
- **Every agent updates "Current State" + "Status Checklist" + "Next Actions" before ending its turn.**

## Commands
```bash
npm install
npm run dev      # localhost:3000
npm run lint
npm run build
vercel --prod    # manual production deploy fallback (no --scope needed)
vercel ls        # list recent deployments
```

## Deployment
- Production branch: `main` → auto-deploys to Vercel production on push.
- Preview deployments: Vercel Git integration creates one for any non-main branch / PR.
- The `*.vercel.app` URLs of individual deployments are gated by Vercel SSO (default Deployment Protection on personal accounts). The production aliases `mundigital.vercel.app` and `mun.digital` are public.

## DNS — live
Authoritative DNS: **Namecheap BasicDNS** (`dns1.registrar-servers.com` / `dns2.registrar-servers.com`). Managed at Namecheap → Domain List → `mun.digital` → Advanced DNS.

Records in place:

| Host | Type | Value         | TTL       | Verified |
| ---- | ---- | ------------- | --------- | -------- |
| `@`  | A    | `76.76.21.21` | Automatic | yes      |
| `www`| A    | `76.76.21.21` | Automatic | yes      |

A SPF TXT record on `@` (`v=spf1 include:spf.efwd.registrar-servers.com ...`) is left in place — harmless; relates to Namecheap email forwarding.

The previous Namecheap "Redirect Domain" (`mun.digital → http://www.mun.digital/`) and parking `CNAME www → parkingpage.namecheap.com.` were removed before adding the A records.

## Status Checklist
- [x] Next.js scaffolded locally
- [x] Node version pinned (24.x in engines.node, 24 in .nvmrc)
- [x] lint + build pass locally
- [x] git initialized, initial commits landed
- [x] GitHub repo created and pushed (renamed to `mun.digital`)
- [x] Vercel project linked (renamed slug to `mun-digital`)
- [x] GitHub auto-deploy verified by placeholder homepage commit
- [x] Default Next homepage replaced with minimal placeholder
- [x] Custom domains (`mun.digital`, `www.mun.digital`) added in Vercel
- [x] Local directory renamed to `~/Projects/mun.digital/`
- [x] Namecheap: redirect/parking removed; A records added for `@` and `www`
- [x] TLS issued; both `https://mun.digital` and `https://www.mun.digital` return 200
- [ ] `www` 308-redirects to apex (currently both serve same content)

## Next Actions
1. Configure `www → apex` redirect in Vercel dashboard. Project `mun-digital` → Settings → Domains → `www.mun.digital` → set "Redirect to" `mun.digital` (308). Verify with `curl -I https://www.mun.digital` showing `308` + `location: https://mun.digital/`.
2. Define site purpose / IA / branding. The placeholder is fine but should be replaced before any meaningful sharing.
3. Replace placeholder homepage at `src/app/page.tsx`; consider full metadata (`opengraph-image`, `twitter:card`, `sitemap.xml`, `robots.txt`).
4. Decide on favicon — currently default Next favicon.
5. Decide on analytics: Vercel Analytics (one-click in dashboard), Plausible, or none.
6. Decide on LICENSE — currently none.
7. Address the 2 moderate `npm audit` vulnerabilities (`npm audit` for details).

## Decision Log
- 2026-04-30: Chose Next.js + TypeScript + Tailwind + App Router scaffold.
- 2026-04-30: Chose public GitHub repo.
- 2026-04-30: Deferred LICENSE selection (none for now); revisit when site purpose is decided.
- 2026-04-30: Chose apex `mun.digital` as canonical despite Vercel's general guidance to use `www` as primary.
- 2026-04-30: No GitHub branch protection initially; revisit once site has meaningful content or collaborators.
- 2026-04-30: Vercel deployments run under the personal account (`mundigital`); no team scope.
- 2026-04-30: Node pinned to major line `24.x` via `engines.node`; `.nvmrc` mirrors major (`24`).
- 2026-04-30: 2 moderate `npm audit` vulnerabilities reported on fresh scaffold; not blocking. Track in Next Actions.
- 2026-04-30: Originally targeted `mundigital.com`; corrected to `mun.digital` once registrar revealed the real domain. Removed the wrong domains from Vercel.
- 2026-04-30: Renamed across surfaces for consistency: GitHub `mundigital` → `mun.digital`; Vercel project slug `mundigital` → `mun-digital` (dots disallowed in slugs); npm name `mundigital` → `mun.digital`; local directory `~/Projects/mundigital` → `~/Projects/mun.digital`.
- 2026-04-30: Pipeline live — `https://mun.digital` serves the placeholder with TLS; `www` resolves but does not redirect to apex yet (deferred to Next Actions).
