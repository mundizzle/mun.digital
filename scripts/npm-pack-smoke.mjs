import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  CallToolResultSchema,
  ListToolsResultSchema,
} from "@modelcontextprotocol/sdk/types.js";

const execFileAsync = promisify(execFile);
const rootDir = path.resolve(import.meta.dirname, "..");
const cliDir = path.join(rootDir, "packages/cli");
const raw = JSON.parse(await fs.readFile(path.join(rootDir, "packages/profile/data/resume.json"), "utf8"));
const privateValues = collectPrivateValues(raw);

const { stdout } = await execFileAsync("npm", ["pack", "--json"], { cwd: cliDir });
const jsonStart = stdout.indexOf("[");
assert(jsonStart >= 0, "npm pack did not return a JSON array");
const pack = JSON.parse(stdout.slice(jsonStart))[0];
const tarballPath = path.join(cliDir, pack.filename);
const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "mundigital-pack-"));
const extractDir = path.join(tmpDir, "extract");
const installDir = path.join(tmpDir, "install");

try {
  await fs.mkdir(extractDir);
  await fs.mkdir(installDir);
  await execFileAsync("tar", ["-xzf", tarballPath, "-C", extractDir]);

  const files = await listFiles(path.join(extractDir, "package"));
  const packedPackage = JSON.parse(
    await fs.readFile(path.join(extractDir, "package/package.json"), "utf8"),
  );
  assert(!files.some((file) => file.startsWith("packages/profile/data/")), "tarball included raw profile data");
  assert(!files.some((file) => file.startsWith("profile/data/")), "tarball included raw profile data");
  assert(files.includes("profile/public/resume.json"), "tarball missing profile/public/resume.json");
  assert(files.includes("profile/public/raindrops.json"), "tarball missing profile/public/raindrops.json");
  assert(files.includes("profile/public/resume.md"), "tarball missing profile/public/resume.md");
  assert(files.includes("profile/public/resume.pdf"), "tarball missing profile/public/resume.pdf");
  for (const webOnlyDependency of ["@mun.digital/profile", "next", "react", "react-dom"]) {
    assert(
      !packedPackage.dependencies?.[webOnlyDependency],
      `tarball package.json should not depend on ${webOnlyDependency}`,
    );
  }

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
  const { stdout: profileStdout } = await execFileAsync("npx", ["mundigital", "profile", "--json"], {
    cwd: installDir,
  });
  const profile = JSON.parse(profileStdout);
  assert(profile.schema_version, "installed CLI output missing schema_version");
  assert(!profile.basics.phone, "installed CLI leaked basics.phone");
  assert(!profile.basics.email, "installed CLI leaked basics.email");
  assert(!profile.basics.location?.address, "installed CLI leaked basics.location.address");
  assert(!profile.basics.location?.postalCode, "installed CLI leaked basics.location.postalCode");
  assert(
    profile.basics.profiles?.some((entry) => entry.url === "https://github.com/mundizzle"),
    "installed CLI output missing GitHub profile",
  );

  const { stdout: briefStdout } = await execFileAsync("npx", ["mundigital", "brief", "--json"], {
    cwd: installDir,
  });
  const brief = JSON.parse(briefStdout);
  assert(brief.schema_version, "installed brief output missing schema_version");
  assert(brief.brief?.includes("https://github.com/mundizzle"), "installed brief output missing GitHub profile");

  await assertInstalledMcp(installDir);

  console.log("npm pack smoke passed");
} finally {
  await fs.rm(tmpDir, { force: true, recursive: true });
  await fs.rm(tarballPath, { force: true });
}

async function assertInstalledMcp(cwd) {
  const client = new Client({
    name: "mundigital-pack-smoke",
    version: "0.1.0",
  });
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["mundigital", "mcp"],
    cwd,
    stderr: "pipe",
  });

  try {
    await client.connect(transport);
    const tools = await client.request({ method: "tools/list" }, ListToolsResultSchema);
    const toolNames = tools.tools.map((tool) => tool.name);
    assert(
      JSON.stringify(toolNames) === JSON.stringify(["search", "brief", "links_search", "links_fetch", "fetch"]),
      `installed MCP expected search, brief, links_search, links_fetch, fetch tools; got ${toolNames.join(", ")}`,
    );

    const search = await client.request(
      {
        method: "tools/call",
        params: {
          name: "search",
          arguments: { query: "github" },
        },
      },
      CallToolResultSchema,
    );
    assert(search.content?.[0]?.type === "text", "installed MCP search did not return text content");
    assert(search.content[0].text.includes("github.com/mundizzle"), "installed MCP search missing GitHub evidence");

    const brief = await client.request(
      {
        method: "tools/call",
        params: {
          name: "brief",
          arguments: {},
        },
      },
      CallToolResultSchema,
    );
    assert(brief.content?.[0]?.type === "text", "installed MCP brief did not return text content");
    assert(brief.content[0].text.includes("github.com/mundizzle"), "installed MCP brief missing GitHub profile");

    const links = await client.request(
      {
        method: "tools/call",
        params: {
          name: "links_search",
          arguments: { query: "design systems" },
        },
      },
      CallToolResultSchema,
    );
    assert(links.content?.[0]?.type === "text", "installed MCP links_search did not return text content");
    assert(JSON.parse(links.content[0].text).schema_version, "installed MCP links_search missing schema_version");
  } finally {
    await transport.close();
  }
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
