## Why

The portfolio UI needs a maintenance pass after the recent content and surface work. The current homepage still has a heavy hero frame, duplicated framed-card treatments, public agent links for surfaces that are not ready, and a browser-hostile MCP link. This pass also reviews the touched code against current Next.js, React, Tailwind, and local repo guidance.

## What Changes

- Move the visible personal brand from the hero title into the site nav as `mundi.morgado`.
- Turn the hero card into a shorter artistic surface with the existing abstract backdrop and a flush portrait, while moving the rotating role above the card.
- Normalize card/panel framing with standard Tailwind `border border-border/60 shadow-sm`.
- Remove Storybook and Design System from the public Agents section for now.
- Remove the testimonial block from the homepage.
- Fix the MCP agent row so browser users land on documentation while the row still displays the hosted MCP endpoint.
- Archive completed OpenSpec changes after validation.
- Perform and document a focused best-practices review for the touched Next.js, React, and Tailwind/CSS surfaces.

## Impact

- Public routes, RSS, sitemap, CLI, MCP protocol behavior, and profile-data sources remain unchanged.
- The homepage visual hierarchy changes: nav carries the visible name, the role sits above the hero card, and the hero card becomes mostly visual.
