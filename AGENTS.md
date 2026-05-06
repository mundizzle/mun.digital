# mun.digital

Canonical operations doc for any agent (Claude, Codex, etc.) opened in this directory. Read this first.

<!-- BEGIN:nextjs-agent-rules -->
## Next.js 16 — read before writing Next-specific code
This version has breaking changes — APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Brief
- Purpose: design-engineer / agentic-design portfolio with a public, agent-readable professional profile.
- Canonical domain: https://mun.digital — **LIVE** with TLS.
- Repository: https://github.com/mundizzle/mun.digital
- Local directory: `/Users/mundizzle/Projects/mun.digital/`
- Deployment: Vercel personal account `mundigital`, project slug `mundigital`

## Project tracking
Project board: [Mun.digital on Linear](https://linear.app/mundizzle/project/mundigital-25dce9d960e8). Day-to-day tasks, module status, and dependencies live there. This file remains the always-loaded ops index. Linear is canonical for planning and task state.

## Current module
Active Linear issue: [REPO-36 — Module C: Rudimentary MCP](https://linear.app/mundizzle/issue/REPO-36/module-c-rudimentary-mcp).

Current Phase 0 scope: local JSON Resume source, public read-only CLI, local stdio MCP, and a JSON-backed resume web UI. Generated Markdown/PDF, npm publishing, and hosted Vercel MCP are deferred fast-follow work.

## Surface inventory (consistency reference)
| Surface | Name |
| --- | --- |
| Domain (canonical) | `mun.digital` |
| Domain (308-redirects to apex) | `www.mun.digital` |
| GitHub repo | `mundizzle/mun.digital` |
| Vercel project slug | `mundigital` |
| Vercel sticky `*.vercel.app` alias | `mundigital.vercel.app` (pre-rename, still active) |
| npm `package.json` name | `@mun.digital/cli` |
| CLI bin | `mundigital` |
| Local MCP server | `mundigital mcp` / `npm run mcp:start` |
| Hosted MCP endpoint | `https://mun.digital/api/mcp` |
| Local directory | `~/Projects/mun.digital/` |
| Registrar | Namecheap (BasicDNS nameservers) |

## Current State (as of 2026-05-06, America/Los_Angeles)
- **Operational task management migrated to Linear** — see project board. The 12 modules are Linear issues (REPO-34 through REPO-45). Day-to-day work runs from there.
- **Sanity removed from this repo's stack (2026-05-03).** Sanity will be used in a separate project the user is setting up later. Content layer for this repo is now JSON Resume + MDX in-repo. Module A (Sanity fluency) is cancelled in Linear; modules B / C / E re-based onto JSON Resume + MDX. Research artifacts in `docs/research/` retained as Sanity-AI-Growth interview-prep material.
- **Module C / REPO-36 in progress.** Phase 0 is local JSON Resume + CLI + stdio MCP + web UI. Fast-follow work added sanitized generated artifacts, a hosted `/api/mcp` route, public npm package `@mun.digital/cli`, and favicon/OG metadata polish.
- **Agent-readable Markdown follow-up tracked in Linear as REPO-48 and implemented locally.** Scope: native `Accept: text/markdown` handling for `/`, root `/llms.txt`, smoke checks, and docs, using the existing sanitized `public/resume.md` pipeline.
- `data/resume.json` is the editorial source of truth. Runtime/public surfaces use generated sanitized artifacts in `public/resume.json`, `public/resume.md`, and `public/resume.pdf`.
- Local scaffold: complete (Next.js 16.2.4, React 19.2.4, Tailwind 4, TypeScript 5, ESLint 9). `npm run lint` and `npm run build` pass.
- Git: pushed to GitHub. `main` is the production branch.
- GitHub: public repo at https://github.com/mundizzle/mun.digital. Description set. No branch protection (intentional).
- Vercel: project `mundigital` linked; Git integration auto-deploys `main` to production. Verified by a real Git-triggered deploy.
- **Pipeline live:** `https://mun.digital` returns HTTP/2 200 with valid TLS serving the JSON-backed resume UI; `https://www.mun.digital` 308-redirects to apex (`location: https://mun.digital/`). DNS resolves correctly (both hosts → `76.76.21.21`).

## Operating Rules
- Package manager: npm.
- Node: pinned to major line `24.x` in `package.json` `engines.node`; `.nvmrc` mirrors `24` for local tooling. Do NOT pin a full patch in `engines.node` — Vercel selects by major line only.
- Framework: Next.js App Router + TypeScript + Tailwind.
- Secrets: Vercel env vars only; never commit `.env*.local`.
- **Every agent updates the active Linear issue + this file's "Current State" before ending its turn.** Status Checklist and Next Actions sections below are now informational pointers to Linear; treat Linear as canonical for task state.
- Public data boundary: CLI/MCP output must exclude `basics.phone`, `basics.location.address`, `basics.location.postalCode`, `meta.private.*`, and `basics.email` unless `meta.publicContact.email=true`.
- Local MCP/CLI are read-only. Do not add write, deploy, shell, arbitrary filesystem, env, secret, telemetry, or postinstall behavior without a new explicit plan.

## Commands
```bash
npm install
npm run dev      # localhost:3000
npm run lint
npm run build
npm run mun -- profile --json
npm run mun -- search "design systems" --json
npm run resume:build
npm run public:smoke
npm run llms:smoke
npm run mcp:start
npm run profile:smoke
npm run mcp:smoke
npm run mcp:http:smoke -- http://localhost:3000/api/mcp
npm run pack:smoke
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

### Phase 1 — Pipeline (shipped)
- [x] Next.js scaffolded locally
- [x] Node version pinned (24.x in engines.node, 24 in .nvmrc)
- [x] lint + build pass locally
- [x] git initialized, initial commits landed
- [x] GitHub repo created and pushed (renamed to `mun.digital`)
- [x] Vercel project linked (renamed slug to `mundigital`)
- [x] GitHub auto-deploy verified by placeholder homepage commit
- [x] Default Next homepage replaced with minimal placeholder
- [x] Custom domains (`mun.digital`, `www.mun.digital`) added in Vercel
- [x] Local directory renamed to `~/Projects/mun.digital/`
- [x] Namecheap: redirect/parking removed; A records added for `@` and `www`
- [x] TLS issued; apex `https://mun.digital` returns 200
- [x] `www.mun.digital` 308-redirects to apex (configured in Vercel dashboard)

### Phase 2.1 — Sanity discovery (cancelled 2026-05-03)

*Sanity removed from this repo's stack; moved to a separate project. [Module A in Linear](https://linear.app/mundizzle/issue/REPO-34) marked Cancelled. Day-1 research yielded durable interview-prep artifacts: `docs/research/sanity-and-mcp.md` (discovery doc) and `docs/research/sanity-ai-growth-brief.md` (interview brief). Both retained.*

### Module catalog (Linear)
Modules B–L sit in the Linear backlog. See the [project board](https://linear.app/mundizzle/project/mundigital-25dce9d960e8) for current state.

## Next Actions

See [Linear project board](https://linear.app/mundizzle/project/mundigital-25dce9d960e8). REPO-36 is active.

**Remaining fast-follow.** `npm audit` follow-up, REPO-48 deploy verification, and broader post-interview polish. Vercel usage guardrails and npm publish are complete; hosted MCP is public at `https://mun.digital/api/mcp`.

## Decision Log
- 2026-04-30: Chose Next.js + TypeScript + Tailwind + App Router scaffold.
- 2026-04-30: Chose public GitHub repo.
- 2026-04-30: Deferred LICENSE selection (none for now); revisit when site purpose is decided.
- 2026-04-30: Chose apex `mun.digital` as canonical despite Vercel's general guidance to use `www` as primary.
- 2026-04-30: No GitHub branch protection initially; revisit once site has meaningful content or collaborators.
- 2026-04-30: Vercel deployments run under the personal account (`mundigital`); no team scope.
- 2026-04-30: Node pinned to major line `24.x` via `engines.node`; `.nvmrc` mirrors major (`24`).
- 2026-04-30: 2 moderate `npm audit` vulnerabilities reported on fresh scaffold; not blocking. Track in Next Actions.
- 2026-04-30: Originally targeted the wrong domain; corrected to `mun.digital` once registrar revealed the real domain. Removed the wrong domains from Vercel.
- 2026-04-30: Renamed across surfaces for consistency: GitHub `mundigital` → `mun.digital`; npm name `mundigital` → `mun.digital`; local directory `~/Projects/mundigital` → `~/Projects/mun.digital`.
- 2026-04-30: Pipeline live — `https://mun.digital` serves the placeholder with TLS; `https://www.mun.digital` 308-redirects to apex via Vercel domain configuration.
- 2026-04-30: Phase 2 strategic direction drafted: design-engineer / agentic-design portfolio; agent-first-as-user editorial spine; first-principles operating mode; Sanity adopted as content backbone; resume-shaped MCP elevated from wishlist to V0 priority because the live Sanity AI Growth opportunity is specifically MCP work.
- 2026-04-30: **Two-tier planning** adopted — overarching arc was separated from phase-level plans. Never roll multi-phase work into a single plan.
- 2026-04-30: **Lean operational docs** convention — `AGENTS.md` is the always-loaded ops index; strategic/contextual material lives outside the ops index and Linear is now canonical.
- 2026-04-30: **Codex multi-round review** adopted as a quality gate for non-trivial plans. Send plan to Codex via `/ask codex`; revise; iterate until consensus. Used successfully on Phase 2.1 plan (3 rounds).
- 2026-04-30: **V0 visual-layer exception.** Phase 2.2 sprint (Path A) ships with a hand-crafted minimal-and-disposable visual layer; this is an explicit, documented deviation from the design-system-as-foundation principle, justified by the live recruiter signal. Phase 2.3 (Foundations) replaces it; expected to be thrown away.
- 2026-04-30: **Phase 2.1 plan approved** after 3 rounds of Codex review. Time-boxed ~2 working days. Day 1 reordered to lead with AI Growth surface + hosted MCP hands-on so interview value lands even if recruiter moves mid-phase.
- 2026-04-30: **Phase 2.1 re-scoped mid-flight.** After Day 1 research and a partially-failed `create-sanity` attempt, the user revised the phase: defer building our own MCP, narrow Phase 2.1 to hands-on Sanity product fluency (Studio installed, real resume content authored, GROQ verified). Rationale: "Before I start building anything on my own, I want to fully understand Sanity as a product first." Phase 2.2 V0 ships without an MCP; MCP becomes its own later phase.
- 2026-05-03: **Sanity removed from `mun.digital` stack.** Sanity integration moves to a separate project the user will set up later. This repo's content layer is now **JSON Resume + MDX** in-repo. Module A (Sanity fluency) cancelled in Linear; the `docs/research/` artifacts retained as durable interview-prep material. Modules B / C / E re-based off Sanity onto JSON Resume + MDX. Rationale: *"I no longer want to include Sanity integration in this repo. I decided that it's better just to stick to building out my own rudimentary MCP. Plan on setting up Sanity but for a different project that will actually use Sanity as needed."*
- 2026-05-03: **Operational task management migrated to Linear** (`Repos` team, project [Mun.digital](https://linear.app/mundizzle/project/mundigital-25dce9d960e8)). Twelve module issues created (REPO-34 through REPO-45); hard dependencies wired (F blockedBy D+B; L blockedBy J+K). Linear is canonical for tasks/sub-tasks/dependencies.
- 2026-05-06: **Phase 0 of Module C started.** Scope narrowed to local JSON Resume + CLI + stdio MCP first; web UI, generated artifacts, npm publish, and hosted Vercel MCP are fast-follow phases.
- 2026-05-06: **Phase 0 web UI fast-follow started.** The `mundizzle.com` dossier/resume visual system is being ported into Next.js using `data/resume.json`; the old markdown/PDF generation pipeline is intentionally not ported.
- 2026-05-06: **Agent-surface fast-follow implemented locally.** Added sanitized public resume projection/artifacts, hosted stateless Streamable HTTP MCP route at `/api/mcp`, package metadata for public scoped npm package `@mun.digital/cli`, MIT license, package tarball smoke gate, robots, sitemap, and JSON-sourced metadata. Npm publish and Vercel usage alert remain operator steps.
- 2026-05-06: **Naming rule tightened.** Public surfaces must use either `mun.digital` or `mundigital`; do not introduce hyphenated variants. The CLI executable and MCP server name are `mundigital`.
- 2026-05-06: **Optional polish pass.** README now leads with MCP/CLI usage, includes concrete Claude Code and Claude Desktop setup notes, and documents the public read-only data boundary. Favicon/Open Graph metadata use the `mun.digital` visual surface. No analytics in V0; revisit after the interview/timeline pressure passes.
