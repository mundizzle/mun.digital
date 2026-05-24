---
version: alpha
name: mun.digital
description: Design system for the mun.digital portfolio site.
tokenSource: design.tokens.json
---

# mun.digital Design System

## Overview

mun.digital uses a technical editorial resume aesthetic: quiet, precise, text-forward, and built for scanning. The interface should feel like a carefully typeset dossier rather than a marketing landing page.

The current visual language is monospaced by default, with sans-serif narrative text used for longer reading. Hierarchy comes from rails, thin rules, uppercase metadata, restrained color, and consistent alignment. The design is intentionally flat; depth is created by tonal contrast, borders, and inset panels rather than shadows.

The machine-readable token source is `design.tokens.json`. `apps/web/src/app/tokens.generated.css` is generated output and must not be edited directly.

## Colors

The palette uses warm paper neutrals in light mode, cool near-black neutrals in dark mode, and a single blue primary accent. Color names follow components.build-style semantic roles with local extensions where the current design needs more levels.

| Previous token | Semantic token | Role |
| --- | --- | --- |
| `bg` | `background` | Page canvas |
| `surface` | `card` | Inset tonal panels |
| `ink` | `foreground` | Primary text |
| `ink-dim` | `muted-foreground` | Body copy and secondary metadata |
| `ink-faint` | `subtle-foreground` | Rail labels, separators, and quiet metadata |
| `rule` | `border` | Standard hairline separators |
| `rule-strong` | `border-strong` | Strong document boundary rules |
| `accent` | `primary` | Links, markers, active affordances, and editorial emphasis |
| `accent-soft` | `primary-soft` | Low-alpha primary tint |
| `grid` | `grid` | Decorative background grid |

`subtle-foreground`, `border-strong`, and `primary-soft` are deliberate local extensions. Do not introduce a shadcn-style `accent` token unless its muted-hover meaning is actually needed; this design's old `accent` maps to `primary`.

Light and dark modes are automatic through `prefers-color-scheme`. The project does not use a `.dark` class or a theme toggle.

## Typography

The base voice is monospace for document structure and metadata. Narrative paragraphs, descriptions, quotations, and contact text use the system sans-serif stack for readability.

Current type is intentionally documented as-is:

- Page title: 28px mobile, 34px desktop, bold, tight line height.
- Section heading: 15px, semibold, uppercase, wide tracking.
- Job title and company row: 18px, semibold emphasis.
- Body copy: 15px, sans-serif, 1.5 to 1.7 line height.
- Rail labels: 11px, uppercase, wide tracking.
- Fine metadata: 10.5px to 13px depending on context.

Do not normalize the type scale in this phase. Future type-scale changes should be separate design-system changes.

## Layout

The layout is a centered single-column document with a desktop rail. The page max width is 860px. Mobile uses a simple stacked flow with 20px horizontal padding. Desktop uses a 120px rail, 28px rail gap, and a computed rail offset for narrative text alignment.

Sections are separated by thin horizontal rules. Rail rows align metadata labels to the left and content to the right on medium viewports and above. The background grid is decorative and must not carry semantic information.

## Elevation & Depth

The system is flat. Visual hierarchy comes from:

- Tonal card surfaces.
- Border strength.
- Left accent borders for selected work and endorsements.
- Rail placement and uppercase metadata.

Do not add decorative shadows, gradient orbs, or card-heavy marketing layouts.

## Shapes

The shape language is mostly square and typographic. Cards and panels use sharp corners. The only rounded shape in the current UI is the small circular CV marker in the header.

Keep rectangular UI elements crisp unless a future component spec explicitly calls for rounding.

## Components

Current components are resume-specific and should stay dense, utilitarian, and readable.

- Header: document identity, location, contact links, and format actions.
- Rail rows: primary layout primitive for metadata plus content.
- Section headers: indexed bracket label in the rail and uppercase heading in content.
- Experience entries: title/company row, context paragraph, bullets, selected work panels, and selected client rows.
- Skills and links: inline wrap lists with primary dash markers.
- Endorsements: card-like quotes using `card` surface and primary left border.
- Agent cue: hidden in print, visible on screen as a quiet machine-readable access note.

Future components.build work should consume these semantic tokens and add component APIs only when a real reusable component requires them.

## Do's and Don'ts

- Do start UI changes from `DESIGN.md`, `design.tokens.json`, and the active OpenSpec change.
- Do use semantic Tailwind utilities such as `bg-background`, `text-foreground`, `text-muted-foreground`, `text-subtle-foreground`, `border-border`, `border-border-strong`, `text-primary`, `bg-primary-soft`, and `bg-card`.
- Do preserve automatic light/dark mode unless a separate spec introduces a theme toggle.
- Do keep print output plain: white background, black text, and no decorative grid.
- Do keep long-form text in the sans-serif voice and structural metadata in the monospace voice.
- Don't edit `tokens.generated.css` directly.
- Don't use raw hex, OKLCH, or arbitrary color values in component class names.
- Don't collapse `muted-foreground` and `subtle-foreground`; they carry different hierarchy levels.
- Don't add `clsx`, `tailwind-merge`, `cn()`, or variant APIs until a real reusable component needs them.
- Don't add a custom prose theme until there is a rendered prose surface to verify.
