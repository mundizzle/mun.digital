<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `apps/web/node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# mun.digital Agent Rules

This file is only for durable rules needed to plan and code correctly in this repo.

## Project State

- Major portfolio features should use their own Git branch and PR.
- Do not add status snapshots, history, roadmaps, task lists, or decision logs to this file.
- Keep task-specific plans, status, and implementation notes in the active PR or the issue/discussion context provided by the user.

## Stack

- Use pnpm.
- Keep local development on Node `24` via `.nvmrc`. In `package.json`, use the broadest safe minimum Node engine for the published CLI so newer Node versions do not warn unnecessarily.
- Use Next.js App Router, TypeScript, and Tailwind.
- Before writing Next-specific code, check the relevant docs in `apps/web/node_modules/next/dist/docs/`; this repo uses Next 16 and some conventions differ from older examples.
- Use `apps/web/src/proxy.ts` for Next 16 request interception. Do not add deprecated `middleware.ts`.

## Local Skills

- Use OpenSpec for spec-driven code changes. Start with `/opsx:propose` for new changes, follow the generated OpenSpec artifacts through implementation, and archive completed changes when appropriate.
- Use locally installed skills when creating functionality, writing code, reviewing code, or deploying this repo.
- For web UI, HTML, CSS, browser APIs, or client-side JavaScript, follow the installed web guidance skills before coding.
- For React or Next.js work, follow the installed React, Next.js, and Vercel React best-practice skills in addition to the local Next 16 docs.
- For deployment, Vercel configuration, Vercel deployment environment variables, or preview/production releases, follow the installed Vercel deployment skills.
- If a relevant skill is unavailable in the current session, note that and continue with the repo rules and official docs.

## Data Boundary

- `packages/profile/data/resume.json` is the editorial source of truth for profile data.
- Public artifacts are generated from sanitized data in `packages/profile/public/` and mirrored to `apps/web/public/` for serving.
- Public outputs must not expose `basics.phone`, `basics.location.address`, `basics.location.postalCode`, `meta.private.*`, or `basics.email` unless `meta.publicContact.email=true`.
- CLI and MCP surfaces are public and read-only. Do not add write, deploy, shell, arbitrary filesystem, environment, secret, telemetry, or postinstall behavior without an explicit plan.
- Do not create a parallel content source for profile data.

## Naming

- Public naming should use `mun.digital` or `mundigital`.
- npm package: `@mun.digital/cli`.
- CLI bin: `mundigital`.
- MCP server name: `mundigital`.
- Do not introduce hyphenated public variants.

## Planning

- Keep plans small and scoped to the active branch or PR.
- For design-system, token, architecture, public-data, MCP, CLI, deployment, agent-surface, or other foundation-level changes, create or update the relevant OpenSpec change before implementation. Review the spec before implementation when cross-agent review is requested, implement against the accepted spec, update the spec before code if the plan changes, and archive the OpenSpec change only after implementation and review are complete.
- For architecture, deployment, public-data, MCP, CLI, or agent-surface changes, state risks and verification before coding.
- Use `/ask claude ...` or the local ask skill when the user requests cross-agent review.
- Keep implementation notes in the active PR or user-provided task context, not in this file.

## Verification

Run the checks that match the changed surface:

```bash
pnpm run lint
pnpm run build
pnpm run resume:build
pnpm run public:smoke
pnpm run llms:smoke
pnpm run profile:smoke
pnpm run mcp:smoke
pnpm run mcp:http:smoke http://localhost:3000/api/mcp
pnpm run pack:smoke
```

## Secrets

- Never commit `.env*.local` or retrieved secrets.
- If credentials are needed, retrieve them from the macOS login Keychain for the current command/session only.
- Do not write credentials to repo files, logs, generated artifacts, or commits.
