# mun.digital Agent Rules

This file is only for durable rules needed to plan and code correctly in this repo. Project state lives in Linear.

## Project State

- Linear is the source of truth for tasks, status, dependencies, and next actions.
- Do not add status snapshots, history, roadmaps, task lists, or decision logs to this file.
- For non-trivial work, use the relevant Linear issue as the scope and update it before ending.

## Stack

- Use npm.
- Keep Node pinned to major line `24.x` in `package.json`; `.nvmrc` should stay `24`.
- Use Next.js App Router, TypeScript, and Tailwind.
- Before writing Next-specific code, check the relevant docs in `node_modules/next/dist/docs/`; this repo uses Next 16 and some conventions differ from older examples.
- Use `src/proxy.ts` for Next 16 request interception. Do not add deprecated `middleware.ts`.

## Data Boundary

- `data/resume.json` is the editorial source of truth for profile data.
- Public artifacts are generated from sanitized data: `public/resume.json`, `public/resume.md`, and `public/resume.pdf`.
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

- Keep plans small and scoped to the active Linear issue.
- For architecture, deployment, public-data, MCP, CLI, or agent-surface changes, state risks and verification before coding.
- Use `/ask claude ...` or the local ask skill when the user requests cross-agent review.
- Keep implementation notes in Linear, not in this file.

## Verification

Run the checks that match the changed surface:

```bash
npm run lint
npm run build
npm run resume:build
npm run public:smoke
npm run llms:smoke
npm run profile:smoke
npm run mcp:smoke
npm run mcp:http:smoke -- http://localhost:3000/api/mcp
npm run pack:smoke
```

## Secrets

- Never commit `.env*.local` or retrieved secrets.
- If credentials are needed, retrieve them from the macOS login Keychain for the current command/session only.
- Do not write credentials to repo files, logs, generated artifacts, or commits.
