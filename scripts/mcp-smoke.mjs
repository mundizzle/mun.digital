import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  CallToolResultSchema,
  GetPromptResultSchema,
  ListPromptsResultSchema,
  ListResourcesResultSchema,
  ListToolsResultSchema,
  ReadResourceResultSchema,
} from "@modelcontextprotocol/sdk/types.js";

const client = new Client({
  name: "mundigital-smoke",
  version: "0.1.0",
});

const transport = new StdioClientTransport({
  command: "node",
  args: ["packages/cli/bin/mundigital.mjs", "mcp"],
  cwd: process.cwd(),
  stderr: "pipe",
});

try {
  await client.connect(transport);

  const resources = await client.request({ method: "resources/list" }, ListResourcesResultSchema);
  assert(resources.resources.length === 1, `expected 1 resource, got ${resources.resources.length}`);
  assert(resources.resources[0].uri === "mun://resume", "expected mun://resume resource");

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
  assert(
    resume.basics.profiles?.some((profile) => profile.url === "https://github.com/mundizzle"),
    "resume resource is missing GitHub profile",
  );

  const tools = await client.request({ method: "tools/list" }, ListToolsResultSchema);
  const toolNames = tools.tools.map((tool) => tool.name);
  assert(
    JSON.stringify(toolNames) === JSON.stringify(["search", "fetch"]),
    `expected search, fetch tools; got ${toolNames.join(", ")}`,
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

  const prompts = await client.request({ method: "prompts/list" }, ListPromptsResultSchema);
  assert(prompts.prompts.length === 1, `expected 1 prompt, got ${prompts.prompts.length}`);
  assert(prompts.prompts[0].name === "portfolio_brief", "expected portfolio_brief prompt");

  const prompt = await client.request(
    {
      method: "prompts/get",
      params: { name: "portfolio_brief" },
    },
    GetPromptResultSchema,
  );
  assert(prompt.messages[0].content.text.includes("mun://resume"), "prompt is not grounded in mun://resume");
  assert(prompt.messages[0].content.text.includes("search"), "prompt is not grounded in search");
  assert(prompt.messages[0].content.text.includes("fetch"), "prompt is not grounded in fetch");

  console.log("mcp smoke passed");
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
  for (const privateField of ["phone", "postalCode", "address", "private", "email"]) {
    assert(!serialized.includes(privateField), `${message}: ${privateField}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
