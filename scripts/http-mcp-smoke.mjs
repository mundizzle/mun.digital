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
  name: "mun-digital-http-smoke",
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

  const tools = await client.request({ method: "tools/list" }, ListToolsResultSchema);
  assert(tools.tools[0]?.name === "search_resume", "expected search_resume tool");

  const search = await client.request(
    {
      method: "tools/call",
      params: {
        name: "search_resume",
        arguments: { query: "design systems" },
      },
    },
    CallToolResultSchema,
  );
  assert(search.content?.[0]?.type === "text", "search_resume did not return text content");
  assert(search.content[0].text.includes("design"), "search_resume did not return design evidence");

  console.log(`http mcp smoke passed: ${url.href}`);
} finally {
  await transport.close();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
