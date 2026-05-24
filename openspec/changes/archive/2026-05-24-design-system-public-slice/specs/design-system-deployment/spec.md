# design-system-deployment Specification

## Purpose
Define deployment behavior for design-system docs and Storybook public surfaces.

## ADDED Requirements

### Requirement: Docs indexing
The docs app SHALL be indexable at `docs.mun.digital`.

#### Scenario: Docs robots policy is requested
- **WHEN** `/robots.txt` is requested from the docs app
- **THEN** it allows indexing of docs pages

### Requirement: Storybook noindex
The Storybook app SHALL be public but noindexed.

#### Scenario: Storybook headers are evaluated
- **WHEN** Storybook static assets or pages are served
- **THEN** responses include `X-Robots-Tag: noindex, nofollow`

#### Scenario: Storybook robots policy is requested
- **WHEN** `/robots.txt` is requested from Storybook
- **THEN** it allows crawling so crawlers can fetch pages and observe the noindex response header

### Requirement: Vercel project configuration
Docs and Storybook SHALL be deployed as separate Vercel projects from the same Git repository.

#### Scenario: Docs Vercel project is configured
- **WHEN** the docs project is inspected
- **THEN** it uses project `mundigital-docs`, root directory `apps/docs`, the Next.js framework preset, build command `pnpm --dir ../.. docs:build`, output directory `.next`, and domain `docs.mun.digital`

#### Scenario: Storybook Vercel project is configured
- **WHEN** the Storybook project is inspected
- **THEN** it uses project `mundigital-storybook`, root directory `apps/storybook`, a static/non-Next framework preset, build command `pnpm --dir ../.. storybook:build`, output directory `storybook-static`, and domain `storybook.mun.digital`

#### Scenario: Workspace files are available during builds
- **WHEN** either new Vercel project builds
- **THEN** files outside the root directory are included so root workspace files and shared packages are available

### Requirement: Shared package rebuilds
Vercel projects SHALL rebuild affected apps when shared tokens or UI change.

#### Scenario: Token or UI package changes
- **WHEN** `packages/tokens` or `packages/ui` changes
- **THEN** docs, Storybook, and web project builds include those package changes through workspace dependencies and Turborepo tasks

#### Scenario: App-only changes
- **WHEN** only one app changes
- **THEN** Vercel ignored-build commands use `npx turbo-ignore` so unaffected projects skip deployment
