import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { fetchMcpEvidence, loadResume, searchMcpEvidence } from "./resume-data.mjs";

export function createMcpServer() {
  const server = new McpServer({
    name: "mundigital",
    version: "0.2.0",
  });

  server.registerResource(
    "resume",
    "mun://resume",
    {
      title: "Mundi Morgado Resume",
      description: "Sanitized public JSON Resume data for Mundi Morgado.",
      mimeType: "application/json",
    },
    async () => {
      const resume = await loadResume();
      return {
        contents: [
          {
            uri: "mun://resume",
            mimeType: "application/json",
            text: JSON.stringify(resume, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "search",
    {
      title: "Search Public Profile",
      description:
        "Search Mundi Morgado's public professional profile, including resume, work history, skills, and endorsements. Returns grounded evidence snippets for follow-up with fetch.",
      inputSchema: {
        query: z.string().min(1).describe("Search query, such as React, design systems, Rails, or endorsements."),
        limit: z.number().int().min(1).max(20).optional().describe("Maximum number of results."),
      },
    },
    async ({ query, limit }) => {
      const result = await searchMcpEvidence(query, { limit });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
        structuredContent: result,
      };
    },
  );

  server.registerTool(
    "fetch",
    {
      title: "Fetch Public Profile Evidence",
      description:
        "Fetch full public profile evidence by id from a previous search result. Use this for grounded citations and detailed analysis.",
      inputSchema: {
        id: z.string().min(1).describe("Evidence id returned by the search tool."),
      },
    },
    async ({ id }) => {
      const result = await fetchMcpEvidence(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
        structuredContent: result,
      };
    },
  );

  server.registerPrompt(
    "portfolio_brief",
    {
      title: "Portfolio Brief",
      description: "Generate a grounded brief using only this MCP server's resume evidence.",
    },
    async () => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text:
              "Use only evidence from mun://resume, search, and fetch to summarize Mundi Morgado's fit for a design-engineering, front-end architecture, or agentic-development conversation. Cite the specific resume sections you rely on and do not invent details.",
          },
        },
      ],
    }),
  );

  return server;
}

export async function runStdioServer() {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("mundigital MCP server running on stdio");
}
