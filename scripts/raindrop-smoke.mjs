import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import {
  fetchRaindropSnapshot,
  sanitizeRaindropItems,
} from "../packages/profile/src/raindrop-links.mjs";

const execFileAsync = promisify(execFile);
const rootDir = path.resolve(import.meta.dirname, "..");
const artifactPath = path.join(rootDir, "packages/profile/public/raindrops.json");
const config = {
  collections: [
    {
      id: 123,
      label: "Design Systems",
      slug: "design-systems",
    },
  ],
  privateTags: ["private"],
  privateTagPrefixes: ["_"],
};
const fixture = [
  {
    _id: 99,
    title: "  Design systems article  ",
    link: "https://example.com/design-systems",
    excerpt: "Useful public excerpt.",
    note: "PRIVATE NOTE MUST NOT LEAK",
    tags: ["tokens", "_draft", "private", "accessibility"],
    collection: { $id: 123 },
    created: "2026-01-02T03:04:05.000Z",
    lastUpdate: "2026-01-03T03:04:05.000Z",
    user: { $id: 456 },
    creatorRef: { _id: 789 },
    cover: "private-cache-reference",
  },
  {
    _id: 1,
    title: "Wrong collection",
    link: "https://example.com/private",
    collection: { $id: 999 },
    created: "2026-01-01T00:00:00.000Z",
  },
];

const first = sanitizeRaindropItems(fixture, config);
const second = sanitizeRaindropItems(fixture, config);
const serialized = JSON.stringify(first);

assert(JSON.stringify(first) === JSON.stringify(second), "raindrop sanitizer output is not deterministic");
assert(first.schema_version === "1.0.0", "raindrop snapshot missing schema_version");
assert(first.links.length === 1, `expected 1 public link, got ${first.links.length}`);

const link = first.links[0];
assert(link.id === "99", "link id should be stringified");
assert(link.collection === "design-systems", "link collection should use public slug");
assert(link.created === "2026-01-02T03:04:05.000Z", "link created date should be ISO");
assert(link.updated === "2026-01-03T03:04:05.000Z", "link updated date should be ISO");
assert(JSON.stringify(link.tags) === JSON.stringify(["accessibility", "tokens"]), "link tags were not filtered and sorted");

for (const forbidden of [
  "PRIVATE NOTE MUST NOT LEAK",
  "note",
  "user",
  "creatorRef",
  "cover",
  "private-cache-reference",
  "456",
  "789",
  "999",
]) {
  assert(!serialized.includes(forbidden), `raindrop public output leaked forbidden value: ${forbidden}`);
}

await assertNoTokenFailsClosed();
await assertEmptyApiFailsClosed();

console.log("raindrop smoke passed");

async function assertNoTokenFailsClosed() {
  const before = await fs.readFile(artifactPath, "utf8");
  const { stdout, stderr } = await execFileAsync(
    "node",
    ["packages/profile/scripts/sync-raindrops.mjs"],
    {
      cwd: rootDir,
      env: withoutRaindropToken(process.env),
    },
  ).catch((error) => error);
  const after = await fs.readFile(artifactPath, "utf8");

  assert(before === after, "sync without token changed raindrops artifact");
  assert(`${stdout ?? ""}${stderr ?? ""}`.includes("RAINDROP_TOKEN is required"), "sync without token did not fail clearly");
}

async function assertEmptyApiFailsClosed() {
  await fetchRaindropSnapshot({
    token: "token",
    config,
    fetchImpl: async () => ({
      ok: true,
      async json() {
        return { items: [] };
      },
    }),
  }).then(
    () => {
      throw new Error("empty Raindrop API response did not fail closed");
    },
    (error) => {
      assert(
        error instanceof Error && error.message.includes("returned no items"),
        "empty Raindrop API response failed with the wrong error",
      );
    },
  );
}

function withoutRaindropToken(env) {
  const nextEnv = { ...env };
  delete nextEnv.RAINDROP_TOKEN;
  return nextEnv;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
