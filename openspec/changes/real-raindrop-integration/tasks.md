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
