import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import {
  fetchRaindropCollections,
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
  requiredTags: ["mun.digital"],
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
    tags: ["Tokens", "#mun.digital", "ACCESSIBILITY", "tokens"],
    collection: { $id: 123 },
    created: "2026-01-02T03:04:05.000Z",
    lastUpdate: "2026-01-03T03:04:05.000Z",
    user: { $id: 456 },
    creatorRef: { _id: 789 },
    cover: "private-cache-reference",
  },
  {
    _id: 3,
    title: "Missing required tag",
    link: "https://example.com/not-selected",
    tags: ["tokens"],
    collection: { $id: 123 },
    created: "2026-01-01T00:00:00.000Z",
  },
  {
    _id: 4,
    title: "Private selected link",
    link: "https://example.com/private-selected",
    tags: ["mun.digital", "private"],
    collection: { $id: 123 },
    created: "2026-01-01T00:00:00.000Z",
  },
  {
    _id: 5,
    title: "Draft selected link",
    link: "https://example.com/draft-selected",
    tags: ["mun.digital", "_draft"],
    collection: { $id: 123 },
    created: "2026-01-01T00:00:00.000Z",
  },
  {
    _id: 1,
    title: "Wrong collection",
    link: "https://example.com/private",
    collection: { $id: 999 },
    created: "2026-01-01T00:00:00.000Z",
  },
  {
    _id: 2,
    title: "Unsafe URL",
    link: "javascript:alert(1)",
    collection: { $id: 123 },
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
assert(
  JSON.stringify(link.tags) === JSON.stringify(["accessibility", "mun.digital", "tokens"]),
  "link tags were not normalized, deduped, and sorted",
);

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
  "Unsafe URL",
  "Missing required tag",
  "Private selected link",
  "Draft selected link",
  "not-selected",
  "private-selected",
  "draft-selected",
  "javascript:",
]) {
  assert(!serialized.includes(forbidden), `raindrop public output leaked forbidden value: ${forbidden}`);
}

await assertNoTokenFailsClosed();
await assertCollectionListingNoTokenFailsClosed();
await assertCollectionListingSanitizesOutput();
await assertRequiredTagsFailClosed();
await assertSystemCollectionIdsFailClosed();
await assertEmptyApiFailsClosed();
await assertSanitizedEmptyFailsClosed();
await assertPaginationFailsClosed();

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

async function assertCollectionListingNoTokenFailsClosed() {
  await fetchRaindropCollections().then(
    () => {
      throw new Error("collection listing without token did not fail closed");
    },
    (error) => {
      assert(
        error instanceof Error && error.message.includes("RAINDROP_TOKEN is required"),
        "collection listing without token failed with the wrong error",
      );
    },
  );
}

async function assertCollectionListingSanitizesOutput() {
  const seenUrls = [];
  const collections = await fetchRaindropCollections({
    token: "secret-token-must-not-leak",
    fetchImpl: async (url, options) => {
      seenUrls.push(String(url));
      assert(
        options?.headers?.Authorization === "Bearer secret-token-must-not-leak",
        "collection listing did not use bearer authorization",
      );
      return {
        ok: true,
        async json() {
          return {
            items: [
              {
                _id: 123,
                title: " Design Systems ",
                count: "7",
                public: false,
                parent: { $id: 456 },
                user: { $id: 999 },
              },
            ],
          };
        },
      };
    },
  });

  assert(seenUrls.some((url) => url.endsWith("/collections")), "root collections endpoint was not requested");
  assert(seenUrls.some((url) => url.endsWith("/collections/childrens")), "child collections endpoint was not requested");
  assert(collections.length === 2, `expected two listed fixture collections, got ${collections.length}`);
  assert(
    JSON.stringify(collections[0]) === JSON.stringify({
      id: "123",
      title: "Design Systems",
      count: 7,
      public: false,
      parentId: "456",
    }),
    "collection listing did not emit the safe public fields",
  );
  assert(!JSON.stringify(collections).includes("secret-token-must-not-leak"), "collection listing leaked token");
  assert(!JSON.stringify(collections).includes("999"), "collection listing leaked user id");
}

async function assertRequiredTagsFailClosed() {
  const result = sanitizeRaindropItems(fixture, {
    ...config,
    requiredTags: [],
  });

  assert(result.links.length === 0, "empty requiredTags should publish nothing");
}

async function assertSystemCollectionIdsFailClosed() {
  for (const id of [0, -1, -99, "not-a-number"]) {
    try {
      sanitizeRaindropItems(fixture, {
        ...config,
        collections: [{ id, label: "System" }],
      });
      throw new Error(`collection id ${id} did not fail closed`);
    } catch (error) {
      assert(
        error instanceof Error && error.message.includes("positive user collection id"),
        `collection id ${id} failed with the wrong error`,
      );
    }
  }
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

async function assertSanitizedEmptyFailsClosed() {
  await fetchRaindropSnapshot({
    token: "token",
    config,
    fetchImpl: async () => ({
      ok: true,
      async json() {
        return {
          items: [
            {
              _id: 100,
              title: "Wrong collection",
              link: "https://example.com/private",
              collection: { $id: 999 },
            },
          ],
        };
      },
    }),
  }).then(
    () => {
      throw new Error("sanitized-empty Raindrop API response did not fail closed");
    },
    (error) => {
      assert(
        error instanceof Error && error.message.includes("no public links"),
        "sanitized-empty Raindrop API response failed with the wrong error",
      );
    },
  );
}

async function assertPaginationFailsClosed() {
  let calls = 0;
  await fetchRaindropSnapshot({
    token: "token",
    config,
    fetchImpl: async () => {
      calls += 1;
      return {
        ok: true,
        async json() {
          return {
            items: Array.from({ length: 50 }, (_, index) => ({
              _id: `${calls}-${index}`,
              title: `Paginated link ${calls}-${index}`,
              link: `https://example.com/${calls}-${index}`,
              collection: { $id: 123 },
              created: "2026-01-01T00:00:00.000Z",
            })),
          };
        },
      };
    },
  }).then(
    () => {
      throw new Error("endless Raindrop pagination did not fail closed");
    },
    (error) => {
      assert(calls === 20, `expected pagination to stop after 20 calls, got ${calls}`);
      assert(
        error instanceof Error && error.message.includes("pagination exceeded"),
        "endless Raindrop pagination failed with the wrong error",
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
