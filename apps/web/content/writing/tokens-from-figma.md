---
title: "From Figma variables to Tailwind theme, in one pnpm script"
date: "2026-03-12"
---

Notes on the export pipeline I built at Gierd: how to keep designers in Figma and engineers in tokens.json without anyone copy-pasting hex codes at 11pm.

Design tokens only work when the source of truth is boring. The useful part is not the JSON shape; it is the shared agreement that Figma variables, code review, package output, and application styles all describe the same contract.
