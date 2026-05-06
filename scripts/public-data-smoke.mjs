import fs from "node:fs/promises";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");
const raw = JSON.parse(await fs.readFile(path.join(rootDir, "data/resume.json"), "utf8"));
const publicJson = JSON.parse(await fs.readFile(path.join(rootDir, "public/resume.json"), "utf8"));
const scannedFiles = [
  "README.md",
  "public/resume.json",
  "public/resume.md",
];

assert(!publicJson.basics?.phone, "public resume leaked basics.phone");
assert(!publicJson.basics?.location?.address, "public resume leaked basics.location.address");
assert(!publicJson.basics?.location?.postalCode, "public resume leaked basics.location.postalCode");
assert(!hasPrivateMeta(publicJson), "public resume leaked meta.private");

if (raw.meta?.publicContact?.email !== true) {
  assert(!publicJson.basics?.email, "public resume leaked basics.email");
}

const privateValues = collectPrivateValues(raw);
for (const file of scannedFiles) {
  const content = await fs.readFile(path.join(rootDir, file), "utf8");
  for (const value of privateValues) {
    assert(!content.includes(value), `${file} leaked private value: ${value}`);
  }
}

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
