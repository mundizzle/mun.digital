# mun.digital

Canonical operations doc for any agent (Claude, Codex, etc.) opened in this directory. Read this first.

<!-- BEGIN:nextjs-agent-rules -->
## Next.js 16 — read before writing Next-specific code
This version has breaking changes — APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Brief
- Purpose: TBD — placeholder personal site at mun.digital; specific concept to be defined.
- Canonical domain: https://mun.digital
- Repository: https://github.com/mundizzle/mun.digital
- Local directory: `/Users/mundizzle/Projects/mun.digital/`
- Deployment: Vercel personal account `mundigital`, project slug `mun-digital` (Vercel disallows dots in slugs)

## Surface inventory (consistency reference)
| Surface | Name |
| --- | --- |
| Domain (canonical) | `mun.digital` |
| Domain (redirect → apex) | `www.mun.digital` |
| GitHub repo | `mundizzle/mun.digital` |
| Vercel project slug | `mun-digital` |
| Vercel sticky `*.vercel.app` alias | `mundigital.vercel.app` (pre-rename, still active) |
| npm `package.json` name | `mun.digital` |
| Local directory | `~/Projects/mun.digital/` |
| Registrar | Namecheap (BasicDNS nameservers) |

## Current State (as of 2026-04-30, America/Los_Angeles)
- Local scaffold: complete (Next.js 16.2.4, React 19.2.4, Tailwind 4, TypeScript 5, ESLint 9). `npm run lint` and `npm run build` pass.
- Git: 6 commits on `main`, pushed to GitHub. `main` is the production branch.
- GitHub: public repo at https://github.com/mundizzle/mun.digital. Description set. No branch protection (intentional).
- Vercel: project `mun-digital` linked; Git integration auto-deploys `main` to production. Last verified by a real Git-triggered deploy in the placeholder-homepage commit. Production alias `mundigital.vercel.app` returns 200 with the placeholder.
- Custom domains: `mun.digital` and `www.mun.digital` are attached to the Vercel project but **not yet live** — DNS records are not in place.
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
- The `*.vercel.app` URLs of individual deployments are gated by Vercel SSO (default Deployment Protection on personal accounts). The production alias `mundigital.vercel.app` and the eventual `mun.digital` are public.

## DNS — pending user action
Authoritative DNS: **Namecheap BasicDNS** (`dns1.registrar-servers.com` / `dns2.registrar-servers.com`). Manage at Namecheap → Domain List → `mun.digital` → Advanced DNS.

Records to add (from `vercel domains inspect mun.digital` and `vercel domains inspect www.mun.digital`):

| Host | Type | Value         | TTL       | Verified |
| ---- | ---- | ------------- | --------- | -------- |
| `@`  | A    | `76.76.21.21` | Automatic | no       |
| `www`| A    | `76.76.21.21` | Automatic | no       |

Note: Vercel currently recommends an **A record** for `www` in this project, not a CNAME. Use what `vercel domains inspect` prints — it is authoritative.

**Conflicts to remove at Namecheap before adding records:**
- "Redirect Domain" entry sending `mun.digital → http://www.mun.digital/` — DELETE this row.
- Any existing `A`/`AAAA`/`ALIAS`/`CNAME` on `@` or `www`.
- Any `CAA` records not allowing `letsencrypt.org` (or remove all CAA records to allow any CA).

Alternative path (NOT chosen): change nameservers to `ns1.vercel-dns.com` / `ns2.vercel-dns.com` and let Vercel manage records. Skip unless DNS-at-Vercel is desired.

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
- [ ] Namecheap: redirect-domain entry removed; A records added for `@` and `www`
- [ ] TLS issued; apex `https://mun.digital` loads; `https://www.mun.digital` 308-redirects to apex

## Next Actions
1. **User** at Namecheap: delete the `mun.digital → http://www.mun.digital/` redirect, then in Advanced DNS add `@ A 76.76.21.21` and `www A 76.76.21.21`. Remove any conflicting records or restrictive CAA entries.
2. After DNS propagates (~2–10 min) verify and finalize:
   ```bash
   dig +short mun.digital A
   dig +short www.mun.digital A
   curl -I https://mun.digital
   curl -I https://www.mun.digital     # expect 308 to https://mun.digital
   vercel domains inspect mun.digital  # should show "Configured"
   vercel domains inspect www.mun.digital
   ```
3. When all three checks pass, flip the last two checkboxes, set Verified=yes in the DNS table, append a Decision Log entry "Pipeline live; placeholder served at apex", commit, push.
4. After pipeline is live, the next chunk of work is content/identity: define site purpose, replace placeholder homepage, decide on favicon, decide on analytics (Vercel Analytics vs Plausible vs none), decide on a LICENSE, address the 2 moderate `npm audit` vulnerabilities.

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
