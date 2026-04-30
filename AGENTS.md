# mundigital

Canonical operations doc for any agent (Claude, Codex, etc.) opened in this directory. Read this first.

<!-- BEGIN:nextjs-agent-rules -->
## Next.js 16 — read before writing Next-specific code
This version has breaking changes — APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Brief
- Purpose: TBD — placeholder personal site at mundigital.com; specific concept to be defined.
- Canonical domain: https://mundigital.com
- Repository: https://github.com/mundizzle/mundigital
- Deployment: Vercel personal account `mundigital`, project `mundigital`

## Current State
- Last verified: 2026-04-30 (America/Los_Angeles)
- Local scaffold: complete (Next.js 16.2.4, React 19.2.4, Tailwind 4, TypeScript 5, ESLint 9)
- GitHub: not created
- Vercel deployment: not linked
- Custom domain: not added
- Placeholder homepage: not replaced (default Next.js scaffold homepage in place)

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
- Production URL: https://mundigital.com (once DNS is live)
- Preview deployments: Vercel Git integration on PR/branch pushes
- Manual deploy fallback: `vercel --prod` (deploys under the authenticated personal account; no `--scope` needed)

## DNS
| Host | Type  | Value                                                   | Source    | Verified |
| ---- | ----- | ------------------------------------------------------- | --------- | -------- |
| @    | A     | <from `vercel domains inspect mundigital.com`>          | Namecheap | no       |
| www  | CNAME | <from `vercel domains inspect www.mundigital.com`>      | Namecheap | no       |

## Status Checklist
- [x] Next.js scaffolded locally
- [x] Node version pinned (24.x in engines.node, 24 in .nvmrc)
- [x] lint + build pass locally
- [ ] git initialized, initial commits landed
- [ ] GitHub repo created and pushed
- [ ] Vercel project linked
- [ ] GitHub auto-deploy verified by placeholder homepage commit
- [ ] Default Next homepage replaced with minimal placeholder
- [ ] Custom domains added in Vercel
- [ ] Namecheap DNS updated
- [ ] TLS issued; apex loads; www → apex redirect verified

## Next Actions
1. `git init -b main` and land two scoped commits (scaffold + docs).
2. `gh repo create mundizzle/mundigital --public --source=. --remote=origin --push`.
3. Vercel preflight: `vercel whoami && vercel teams ls`. If `--scope mundigital` is rejected as personal account (it is), omit `--scope`/`--team` from all Vercel commands.
4. `vercel link --yes --project mundigital && vercel --prod`.
5. `vercel git connect --yes` (fallback to dashboard import if it errors).
6. Replace `src/app/page.tsx` and `src/app/layout.tsx` metadata with placeholder; push to `main`; verify auto-deploy with `vercel ls`.
7. `vercel domains add mundigital.com mundigital`, `vercel domains add www.mundigital.com mundigital`, capture `vercel domains inspect` output, hand DNS records to user for Namecheap.
8. After DNS propagates: dig + curl + browser verification of TLS, apex, and www→apex redirect.

## Decision Log
- 2026-04-30: Chose Next.js + TypeScript + Tailwind + App Router scaffold.
- 2026-04-30: Chose public GitHub repo.
- 2026-04-30: Deferred LICENSE selection (none for now); revisit when site purpose is decided.
- 2026-04-30: Chose apex `mundigital.com` as canonical despite Vercel's general guidance to use `www` as primary.
- 2026-04-30: No GitHub branch protection initially; revisit once site has meaningful content or collaborators.
- 2026-04-30: Vercel deployments run under the personal account (`mundigital`); no team scope.
- 2026-04-30: Node pinned to major line `24.x` via `engines.node`; `.nvmrc` mirrors major (`24`).
- 2026-04-30: 2 moderate npm audit vulnerabilities reported on fresh scaffold; not blocking. Track in Next Actions later.
