import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

await assertProfile();
await assertSearch("React");
await assertSearch("design systems");
await assertSearch("agentic");

console.log("profile smoke passed");

async function assertProfile() {
  const { stdout } = await execFileAsync("node", ["bin/mundigital.mjs", "profile", "--json"]);
  const profile = JSON.parse(stdout);

  assert(profile.schema_version, "profile is missing schema_version");
  assert(!profile.basics.phone, "profile leaked basics.phone");
  assert(!profile.basics.email, "profile leaked basics.email");
  assert(!profile.basics.location?.address, "profile leaked basics.location.address");
  assert(!profile.basics.location?.postalCode, "profile leaked basics.location.postalCode");
}

async function assertSearch(query) {
  const { stdout } = await execFileAsync("node", ["bin/mundigital.mjs", "search", query, "--json"]);
  const result = JSON.parse(stdout);

  assert(result.schema_version, `search ${query} is missing schema_version`);
  assert(result.query === query, `search ${query} did not echo query`);
  assert(result.results.length > 0, `search ${query} returned no evidence`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
