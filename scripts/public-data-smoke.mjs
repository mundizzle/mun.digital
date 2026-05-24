import fs from "node:fs/promises";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");
const raw = JSON.parse(await fs.readFile(path.join(rootDir, "packages/profile/data/resume.json"), "utf8"));
const publicJson = JSON.parse(await fs.readFile(path.join(rootDir, "packages/profile/public/resume.json"), "utf8"));
const publicLinks = JSON.parse(await fs.readFile(path.join(rootDir, "packages/profile/public/raindrops.json"), "utf8"));
const scannedFiles = [
  "README.md",
  "packages/profile/public/resume.json",
  "packages/profile/public/resume.md",
  "packages/profile/public/raindrops.json",
  "packages/cli/profile/public/resume.json",
  "packages/cli/profile/public/resume.md",
  "packages/cli/profile/public/raindrops.json",
  "apps/web/public/llms.txt",
  "apps/web/public/resume.json",
  "apps/web/public/resume.md",
  "apps/web/public/raindrops.json",
];
const githubProfileUrl = "https://github.com/mundizzle";
const githubProfileText = "github.com/mundizzle";

assert(!publicJson.basics?.phone, "public resume leaked basics.phone");
assert(!publicJson.basics?.location?.address, "public resume leaked basics.location.address");
assert(!publicJson.basics?.location?.postalCode, "public resume leaked basics.location.postalCode");
assert(!hasPrivateMeta(publicJson), "public resume leaked meta.private");

if (raw.meta?.publicContact?.email !== true) {
  assert(!publicJson.basics?.email, "public resume leaked basics.email");
}

assert(
  publicJson.basics?.profiles?.some((profile) => profile.url === githubProfileUrl),
  "public resume is missing GitHub profile",
);
await assertMirroredArtifact("resume.json");
await assertMirroredArtifact("raindrops.json");
await assertMirroredArtifact("resume.md");
await assertMirroredArtifact("resume.pdf");
await assertMirroredArtifact("mundi-morgado-resume.pdf");
await assertCliMirror();

const markdown = await fs.readFile(path.join(rootDir, "packages/profile/public/resume.md"), "utf8");
assert(markdown.includes(githubProfileText), "public resume markdown is missing GitHub profile");

const llms = await fs.readFile(path.join(rootDir, "apps/web/public/llms.txt"), "utf8");
for (const expected of ["/raindrops.json", "links_search", "links_fetch", "sanitized public snapshot"]) {
  assert(llms.includes(expected), `llms.txt missing ${expected}`);
}

const privateValues = collectPrivateValues(raw);
for (const file of scannedFiles) {
  const content = await fs.readFile(path.join(rootDir, file), "utf8");
  for (const value of privateValues) {
    assert(!content.includes(value), `${file} leaked private value: ${value}`);
  }
}

async function assertMirroredArtifact(filename) {
  const profileArtifact = await fs.readFile(path.join(rootDir, "packages/profile/public", filename));
  const webArtifact = await fs.readFile(path.join(rootDir, "apps/web/public", filename));
  assert(
    profileArtifact.equals(webArtifact),
    `apps/web/public/${filename} is not mirrored from packages/profile/public/${filename}`,
  );
}

async function assertCliMirror() {
  for (const filename of [
    "resume.json",
    "raindrops.json",
    "resume.md",
    "resume.pdf",
    "mundi-morgado-resume.pdf",
  ]) {
    const profileArtifact = await fs.readFile(path.join(rootDir, "packages/profile/public", filename));
    const cliArtifact = await fs.readFile(path.join(rootDir, "packages/cli/profile/public", filename));
    assert(
      profileArtifact.equals(cliArtifact),
      `packages/cli/profile/public/${filename} is not mirrored from packages/profile/public/${filename}`,
    );
  }

  for (const filename of [
    "mcp-server.mjs",
    "raindrop-links.mjs",
    "resume-data.mjs",
    "sanitize-resume.mjs",
  ]) {
    const profileSource = await fs.readFile(path.join(rootDir, "packages/profile/src", filename));
    const cliSource = await fs.readFile(path.join(rootDir, "packages/cli/profile/src", filename));
    assert(
      profileSource.equals(cliSource),
      `packages/cli/profile/src/${filename} is not mirrored from packages/profile/src/${filename}`,
    );
  }
}

assert(publicLinks.schema_version, "public raindrops missing schema_version");
assert(Array.isArray(publicLinks.links), "public raindrops links must be an array");
assertNoRaindropPrivateFields(publicLinks);

console.log("public data smoke passed");

function collectPrivateValues(resume) {
  return [
    resume.basics?.phone,
    resume.meta?.publicContact?.email === true ? null : resume.basics?.email,
    resume.basics?.location?.address,
    resume.basics?.location?.postalCode,
    ...flatten(resume.meta?.private),
  ].filter((value) => typeof value === "string" && value.length > 3);
}

function hasPrivateMeta(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (!Array.isArray(value) && Object.hasOwn(value, "private")) {
    return true;
  }

  return Object.values(value).some(hasPrivateMeta);
}

function assertNoRaindropPrivateFields(value) {
  const serialized = JSON.stringify(value);
  for (const privateField of ["note", "user", "creatorRef", "media", "cache", "file", "cover", "collectionId"]) {
    assert(!serialized.includes(privateField), `public raindrops leaked private field: ${privateField}`);
  }
}

function flatten(value) {
  if (!value) {
    return [];
  }

  if (typeof value !== "object") {
    return [value];
  }

  return Object.values(value).flatMap(flatten);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
