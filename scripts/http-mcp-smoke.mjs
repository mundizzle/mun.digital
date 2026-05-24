import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  CallToolResultSchema,
  ListResourcesResultSchema,
  ListToolsResultSchema,
  ReadResourceResultSchema,
} from "@modelcontextprotocol/sdk/types.js";

const url = new URL(process.argv[2] ?? "http://localhost:3000/api/mcp");
const client = new Client({
  name: "mundigital-http-smoke",
  version: "0.1.0",
});
const transport = new StreamableHTTPClientTransport(url);

try {
  await client.connect(transport);

  const resources = await client.request({ method: "resources/list" }, ListResourcesResultSchema);
  assert(resources.resources[0]?.uri === "mun://resume", "expected mun://resume resource");

  const resource = await client.request(
    {
      method: "resources/read",
      params: { uri: "mun://resume" },
    },
    ReadResourceResultSchema,
  );
  const resume = JSON.parse(resource.contents[0].text);
  assert(resume.schema_version, "resume resource is missing schema_version");
  assert(!resume.basics.phone, "resume resource leaked basics.phone");
  assert(!resume.basics.email, "resume resource leaked basics.email");
  assert(!resume.basics.location?.address, "resume resource leaked basics.location.address");
  assert(!resume.basics.location?.postalCode, "resume resource leaked basics.location.postalCode");
  assert(
    resume.basics.profiles?.some((profile) => profile.url === "https://github.com/mundizzle"),
    "resume resource is missing GitHub profile",
  );

  const tools = await client.request({ method: "tools/list" }, ListToolsResultSchema);
  const toolNames = tools.tools.map((tool) => tool.name);
  assert(
    JSON.stringify(toolNames) === JSON.stringify(["search", "brief", "links_search", "links_fetch", "fetch"]),
    `expected search, brief, links_search, links_fetch, fetch tools; got ${toolNames.join(", ")}`,
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
  assert(search.content?.[0]?.type === "text", "search did not return text content");
  const searchResult = JSON.parse(search.content[0].text);
  assert(searchResult.results?.[0]?.id, "search result is missing id");
  assert(searchResult.results[0].title, "search result is missing title");
  assert(searchResult.results[0].text, "search result is missing text snippet");
  assert(searchResult.results[0].url, "search result is missing url");
  assert(search.content[0].text.includes("github.com/mundizzle"), "search did not return GitHub evidence");

  const fetched = await callTool("fetch", { id: searchResult.results[0].id });
  assert(fetched.id === searchResult.results[0].id, "fetch did not return requested id");
  assert(fetched.text.includes(searchResult.results[0].text), "fetch text did not include search snippet");
  assertNoPrivateFields(fetched, "fetch result leaked private fields");

  const brief = await callTool("brief", {});
  assert(brief.schema_version, "brief result is missing schema_version");
  assert(brief.brief?.includes("https://github.com/mundizzle"), "brief result is missing GitHub profile");
  assertNoPrivateFields(brief, "brief result leaked private fields");

  const links = await callTool("links_search", { query: "design systems" });
  assert(links.schema_version, "links_search result is missing schema_version");
  assert(Array.isArray(links.results), "links_search result is missing results");
  assertNoPrivateFields(links, "links_search result leaked private fields");

  const unknownLinkFetch = await client.request(
    {
      method: "tools/call",
      params: {
        name: "links_fetch",
        arguments: { id: "nope" },
      },
    },
    CallToolResultSchema,
  );
  assert(unknownLinkFetch.isError === true, "unknown links_fetch id did not return an MCP tool error");

  const endorsements = await client.request(
    {
      method: "tools/call",
      params: {
        name: "search",
        arguments: { query: "what are people saying about Mundi" },
      },
    },
    CallToolResultSchema,
  );
  assert(
    endorsements.content?.[0]?.text.includes("Endorsement:"),
    "search did not return endorsement evidence",
  );
  const endorsementSearch = JSON.parse(endorsements.content[0].text);
  assertNoPrivateFields(endorsementSearch, "endorsement search leaked private fields");
  const endorsementFetch = await callTool("fetch", { id: endorsementSearch.results[0].id });
  assert(endorsementFetch.title.startsWith("Endorsement:"), "fetch did not return endorsement evidence");
  assertNoPrivateFields(endorsementFetch, "endorsement fetch leaked private fields");

  const unknownFetch = await client.request(
    {
      method: "tools/call",
      params: {
        name: "fetch",
        arguments: { id: "nope" },
      },
    },
    CallToolResultSchema,
  );
  assert(unknownFetch.isError === true, "unknown fetch id did not return an MCP tool error");

  console.log(`http mcp smoke passed: ${url.href}`);
} finally {
  await transport.close();
}

async function callTool(name, args) {
  const result = await client.request(
    {
      method: "tools/call",
      params: {
        name,
        arguments: args,
      },
    },
    CallToolResultSchema,
  );

  assert(result.content?.[0]?.type === "text", `${name} did not return text content`);
  const parsed = JSON.parse(result.content[0].text);
  assertNoPrivateFields(parsed, `${name} leaked private fields`);
  return parsed;
}

function assertNoPrivateFields(value, message) {
  const serialized = JSON.stringify(value);
  for (const privateField of ["phone", "postalCode", "address", "private", "email", "note", "creatorRef"]) {
    assert(!serialized.includes(privateField), `${message}: ${privateField}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
