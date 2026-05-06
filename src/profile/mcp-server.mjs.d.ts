import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function createMcpServer(): McpServer;
export function runStdioServer(): Promise<void>;
