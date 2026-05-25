## 1. OpenSpec

- [x] 1.1 Add OpenSpec artifacts for the real Raindrop integration gate.
- [x] 1.2 Update `raindrop-sync` and add collection discovery requirements.
- [x] 1.3 Validate OpenSpec strictly.

## 2. Sync Safety

- [x] 2.1 Add `requiredTags` config with fail-closed behavior.
- [x] 2.2 Normalize all tags once for matching and emitted public output.
- [x] 2.3 Exclude private-tagged items at item level.
- [x] 2.4 Reject missing, zero, or negative configured collection ids.

## 3. Collection Discovery

- [x] 3.1 Add a read-only `raindrop:collections` script.
- [x] 3.2 Ensure discovery output never includes `RAINDROP_TOKEN`.

## 4. Verification

- [x] 4.1 Extend Raindrop smoke coverage for required tags, private-item exclusion, system ids, and collection discovery.
- [x] 4.2 Run OpenSpec validation and relevant repo checks.

## 5. Real Snapshot

- [x] 5.1 Select positive allowlisted collections containing `mun.digital` bookmarks.
- [x] 5.2 Commit the first sanitized public snapshot and mirrored artifacts.
- [x] 5.3 Exclude tagged bookmarks in system collections such as `Unsorted`.

## 6. Web App

- [x] 6.1 Replace app-local reading fixtures with generated Raindrop snapshot data.
- [x] 6.2 Hide the reading rail when the generated snapshot is empty.

## 7. Automation

- [x] 7.1 Add a daily and manually dispatchable Raindrop sync workflow.
- [x] 7.2 Gate workflow PR creation on sync and verification success.
