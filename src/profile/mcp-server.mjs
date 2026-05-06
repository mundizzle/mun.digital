import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { loadResume, searchResume } from "./resume-data.mjs";

export function createMcpServer() {
  const server = new McpServer({
    name: "mundigital",
    version: "0.1.0",
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
    "search_resume",
    {
      title: "Search Resume",
      description: "Search the sanitized public resume and return grounded evidence snippets.",
      inputSchema: {
        query: z.string().min(1).describe("Search query, such as React, design systems, or agentic."),
        limit: z.number().int().min(1).max(20).optional().describe("Maximum number of results."),
      },
    },
    async ({ query, limit }) => {
      const result = await searchResume(query, { limit });
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
              "Use only evidence from mun://resume and search_resume to summarize Mundi Morgado's fit for a design-engineering, front-end architecture, or agentic-development conversation. Cite the specific resume sections you rely on and do not invent details.",
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
