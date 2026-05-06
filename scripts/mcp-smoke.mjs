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
  args: ["bin/mundigital.mjs", "mcp"],
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
  assert(tools.tools.length === 1, `expected 1 tool, got ${tools.tools.length}`);
  assert(tools.tools[0].name === "search_resume", "expected search_resume tool");

  const search = await client.request(
    {
      method: "tools/call",
      params: {
        name: "search_resume",
        arguments: { query: "github" },
      },
    },
    CallToolResultSchema,
  );
  assert(search.content?.[0]?.type === "text", "search_resume did not return text content");
  assert(search.content[0].text.includes("github.com/mundizzle"), "search_resume did not return GitHub evidence");

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

  console.log("mcp smoke passed");
} finally {
  await transport.close();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
