## Context

The current implementation already fetches Raindrop items with `RAINDROP_TOKEN`, sanitizes an explicit public field allowlist, and mirrors `raindrops.json` into website and CLI package artifacts. The real integration should preserve that read-only public runtime model while adding an intentional publication gate.

Claude reviewed the plan and called out privacy risks to address before any real data sync: private-tagged items must be excluded entirely, system collection ids must not be accepted, tag normalization must be consistent, and the public switch tag behavior must be explicit.

## Decisions

1. Publish only allowlisted collection plus required tag.

   `requiredTags` is added to `packages/profile/data/raindrop.config.json` and defaults to fail-closed behavior. An item must match an explicit positive collection id and at least one required tag after normalization.

2. Private tags remove the whole item.

   Any item with a tag matching `privateTags` or `privateTagPrefixes`, after normalization, is omitted from the public snapshot even if it also has `mun.digital`.

3. Public tags are normalized and include the switch tag.

   Published tags are lowercase, deduped, sorted, and stripped of any leading `#`. The `mun.digital` tag remains visible as provenance that the bookmark was intentionally selected.

4. Collection discovery is local and read-only.

   `pnpm run raindrop:collections` requires `RAINDROP_TOKEN`, calls Raindrop root and child collection endpoints, and prints id/title/count/public/parent only. It does not write files and does not print the token.

5. Follow-up PR owns real ids and automation.

   This change adds the safe machinery. A second PR will commit selected collection config, run the first real sync, wire the homepage reading rail to generated links, and add the daily pull-request workflow.

6. Daily automation opens PRs, not direct pushes.

   The scheduled workflow uses the `RAINDROP_TOKEN` GitHub secret, runs sync plus verification in-job, and uses minimal repository write permissions only to open or update a generated-data PR.

## Risks / Trade-offs

- Keeping `mun.digital` in public tags exposes the selection marker, but that is intentional and testable.
- The discovery helper may print private collection titles to the terminal, so it remains a local command and its output must not be committed.
- Empty or missing `requiredTags` publishes nothing, which is safer than collection-only publication.

## Migration Plan

1. Update Raindrop spec text for required tags, private-item exclusion, collection id validation, and collection discovery.
2. Add config validation, tag normalization, and required tag filtering to the sanitizer.
3. Add local collection discovery script and package script.
4. Extend smoke tests for privacy, fail-closed required tags, system collection ids, and discovery output.
5. Configure selected collection ids and commit the first sanitized public snapshot.
6. Wire the homepage reading rail to the generated snapshot.
7. Add a daily workflow that syncs Raindrop into a pull request after checks pass.
