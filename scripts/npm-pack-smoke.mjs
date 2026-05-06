import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const rootDir = path.resolve(import.meta.dirname, "..");
const raw = JSON.parse(await fs.readFile(path.join(rootDir, "data/resume.json"), "utf8"));
const privateValues = collectPrivateValues(raw);

const { stdout } = await execFileAsync("npm", ["pack", "--json"], { cwd: rootDir });
const jsonStart = stdout.indexOf("[");
assert(jsonStart >= 0, "npm pack did not return a JSON array");
const pack = JSON.parse(stdout.slice(jsonStart))[0];
const tarballPath = path.join(rootDir, pack.filename);
const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "mun-digital-pack-"));
const extractDir = path.join(tmpDir, "extract");
const installDir = path.join(tmpDir, "install");

try {
  await fs.mkdir(extractDir);
  await fs.mkdir(installDir);
  await execFileAsync("tar", ["-xzf", tarballPath, "-C", extractDir]);

  const files = await listFiles(path.join(extractDir, "package"));
  assert(!files.some((file) => file.startsWith("data/")), "tarball included raw data directory");
  assert(files.includes("public/resume.json"), "tarball missing public/resume.json");
  assert(files.includes("public/resume.md"), "tarball missing public/resume.md");
  assert(files.includes("public/resume.pdf"), "tarball missing public/resume.pdf");

  for (const file of files) {
    const filePath = path.join(extractDir, "package", file);
    const content = await readTextIfPossible(filePath);
    if (!content) {
      continue;
    }

    for (const value of privateValues) {
      assert(!content.includes(value), `${file} leaked private value: ${value}`);
    }
  }

  await execFileAsync("npm", ["install", tarballPath, "--ignore-scripts"], { cwd: installDir });
  const { stdout: profileStdout } = await execFileAsync("npx", ["mun-digital", "profile", "--json"], {
    cwd: installDir,
  });
  const profile = JSON.parse(profileStdout);
  assert(profile.schema_version, "installed CLI output missing schema_version");
  assert(!profile.basics.phone, "installed CLI leaked basics.phone");
  assert(!profile.basics.email, "installed CLI leaked basics.email");
  assert(!profile.basics.location?.address, "installed CLI leaked basics.location.address");
  assert(!profile.basics.location?.postalCode, "installed CLI leaked basics.location.postalCode");

  console.log("npm pack smoke passed");
} finally {
  await fs.rm(tmpDir, { force: true, recursive: true });
  await fs.rm(tarballPath, { force: true });
}

async function listFiles(dir, base = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listFiles(entryPath, base);
      }

      return path.relative(base, entryPath);
    }),
  );

  return files.flat().sort();
}

async function readTextIfPossible(filePath) {
  const buffer = await fs.readFile(filePath);

  if (buffer.includes(0)) {
    return null;
  }

  return buffer.toString("utf8");
}

function collectPrivateValues(resume) {
  return [
    resume.basics?.phone,
    resume.meta?.publicContact?.email === true ? null : resume.basics?.email,
    resume.basics?.location?.address,
    resume.basics?.location?.postalCode,
    ...flatten(resume.meta?.private),
  ].filter((value) => typeof value === "string" && value.length > 3);
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
