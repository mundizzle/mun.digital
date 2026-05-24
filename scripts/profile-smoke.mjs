import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const cliBin = "packages/cli/bin/mundigital.mjs";

await assertProfile();
await assertSearch("React");
await assertSearch("design systems");
await assertSearch("agentic");
await assertSearch("github");
await assertSearchIncludes("what are people saying about Mundi", "Endorsement:");
await assertLinks();

console.log("profile smoke passed");

async function assertProfile() {
  const { stdout } = await execFileAsync("node", [cliBin, "profile", "--json"]);
  const profile = JSON.parse(stdout);

  assert(profile.schema_version, "profile is missing schema_version");
  assert(!profile.basics.phone, "profile leaked basics.phone");
  assert(!profile.basics.email, "profile leaked basics.email");
  assert(!profile.basics.location?.address, "profile leaked basics.location.address");
  assert(!profile.basics.location?.postalCode, "profile leaked basics.location.postalCode");
  assert(
    profile.basics.profiles?.some((profile) => profile.url === "https://github.com/mundizzle"),
    "profile is missing GitHub profile",
  );

  const { stdout: textStdout } = await execFileAsync("node", [cliBin, "profile"]);
  assert(textStdout.includes("https://github.com/mundizzle"), "profile text is missing GitHub profile");
}

async function assertSearch(query) {
  const { stdout } = await execFileAsync("node", [cliBin, "search", query, "--json"]);
  const result = JSON.parse(stdout);

  assert(result.schema_version, `search ${query} is missing schema_version`);
  assert(result.query === query, `search ${query} did not echo query`);
  assert(result.results.length > 0, `search ${query} returned no evidence`);
}

async function assertSearchIncludes(query, expectedText) {
  const { stdout } = await execFileAsync("node", [cliBin, "search", query, "--json"]);
  const result = JSON.parse(stdout);

  assert(result.schema_version, `search ${query} is missing schema_version`);
  assert(result.query === query, `search ${query} did not echo query`);
  assert(
    result.results.some((entry) => entry.section.includes(expectedText) || entry.text.includes(expectedText)),
    `search ${query} did not include ${expectedText}`,
  );
}

async function assertLinks() {
  const { stdout } = await execFileAsync("node", [cliBin, "links", "--json"]);
  const links = JSON.parse(stdout);

  assert(links.schema_version, "links output is missing schema_version");
  assert(Array.isArray(links.links), "links output is missing links array");

  const { stdout: searchStdout } = await execFileAsync("node", [cliBin, "links", "search", "design", "--json"]);
  const search = JSON.parse(searchStdout);
  assert(search.schema_version, "links search output is missing schema_version");
  assert(search.query === "design", "links search did not echo query");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
