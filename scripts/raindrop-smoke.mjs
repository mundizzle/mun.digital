import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import {
  fetchRaindropCollections,
  fetchRaindropSnapshot,
  sanitizeLinkSnapshot,
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
    cover: "https://images.example.com/design-systems.jpg",
    media: [{ link: "https://images.example.com/unused-media.jpg" }],
    cache: { status: "PRIVATE CACHE MUST NOT LEAK" },
    file: { name: "PRIVATE FILE MUST NOT LEAK" },
  },
  {
    _id: 100,
    title: "Media thumbnail article",
    link: "https://example.com/media-thumbnail",
    excerpt: "Uses media thumbnail.",
    tags: ["mun.digital"],
    collection: { $id: 123 },
    created: "2026-01-04T03:04:05.000Z",
    lastUpdate: "2026-01-05T03:04:05.000Z",
    cover: "data:image/png;base64,unsafe",
    media: [
      { link: "javascript:alert(1)" },
      { link: "https://images.example.com/media-thumbnail.jpg" },
    ],
  },
  {
    _id: 101,
    title: "Unsafe thumbnail article",
    link: "https://example.com/unsafe-thumbnail",
    excerpt: "No thumbnail should be emitted.",
    tags: ["mun.digital"],
    collection: { $id: 123 },
    created: "2026-01-01T03:04:05.000Z",
    cover: "file:///private.png",
    media: [
      { link: "blob:https://example.com/private" },
      { link: "data:image/png;base64,unsafe" },
    ],
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
assert(first.schema_version === "1.1.0", "raindrop snapshot missing schema_version");
assert(first.links.length === 3, `expected 3 public links, got ${first.links.length}`);
assertNoRawPrivateKeys(first);

const link = first.links.find((entry) => entry.id === "99");
assert(link, "safe cover fixture link missing");
assert(link.id === "99", "link id should be stringified");
assert(link.collection === "design-systems", "link collection should use public slug");
assert(link.created === "2026-01-02T03:04:05.000Z", "link created date should be ISO");
assert(link.updated === "2026-01-03T03:04:05.000Z", "link updated date should be ISO");
assert(link.thumbnailUrl === "https://images.example.com/design-systems.jpg", "link thumbnail should use safe cover");
assert(
  JSON.stringify(link.tags) === JSON.stringify(["accessibility", "mun.digital", "tokens"]),
  "link tags were not normalized, deduped, and sorted",
);

const mediaThumbnailLink = first.links.find((entry) => entry.id === "100");
assert(mediaThumbnailLink, "safe media thumbnail fixture link missing");
assert(
  mediaThumbnailLink.thumbnailUrl === "https://images.example.com/media-thumbnail.jpg",
  "link thumbnail should fall back to the first safe media link",
);

const unsafeThumbnailLink = first.links.find((entry) => entry.id === "101");
assert(unsafeThumbnailLink, "unsafe thumbnail fixture link missing");
assert(!Object.hasOwn(unsafeThumbnailLink, "thumbnailUrl"), "unsafe thumbnail link should not emit thumbnailUrl");

const resanitized = sanitizeLinkSnapshot({
  links: [
    {
      ...link,
      thumbnailUrl: "https://images.example.com/resanitized.jpg",
      cover: "PRIVATE RAW COVER MUST NOT LEAK",
      media: [{ link: "PRIVATE RAW MEDIA MUST NOT LEAK" }],
    },
    {
      ...unsafeThumbnailLink,
      thumbnailUrl: "blob:https://example.com/private",
    },
  ],
});
assert(
  resanitized.links.find((entry) => entry.id === "99")?.thumbnailUrl === "https://images.example.com/resanitized.jpg",
  "runtime link sanitizer should preserve safe thumbnailUrl",
);
assert(
  !Object.hasOwn(resanitized.links.find((entry) => entry.id === "101") ?? {}, "thumbnailUrl"),
  "runtime link sanitizer should omit unsafe thumbnailUrl",
);
assertNoRawPrivateKeys(resanitized);

for (const forbidden of [
  "PRIVATE NOTE MUST NOT LEAK",
  "PRIVATE CACHE MUST NOT LEAK",
  "PRIVATE FILE MUST NOT LEAK",
  "note",
  "user",
  "creatorRef",
  "cover",
  "cache",
  "file",
  "PRIVATE RAW COVER MUST NOT LEAK",
  "PRIVATE RAW MEDIA MUST NOT LEAK",
  "unused-media",
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
  "data:",
  "blob:",
  "file:",
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

function assertNoRawPrivateKeys(value) {
  for (const privateField of ["note", "user", "creatorRef", "media", "cache", "file", "cover", "collectionId"]) {
    assert(!hasObjectKey(value, privateField), `raindrop public output leaked private field: ${privateField}`);
  }
}

function hasObjectKey(value, key) {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (!Array.isArray(value) && Object.hasOwn(value, key)) {
    return true;
  }

  return Object.values(value).some((child) => hasObjectKey(child, key));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
