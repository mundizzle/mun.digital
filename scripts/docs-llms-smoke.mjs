import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsContentDir = path.join(rootDir, "apps/docs/content");
const docsRegistryPath = path.join(rootDir, "apps/docs/src/lib/docs.tsx");
const cliBinPath = path.join(rootDir, "packages/cli/bin/mundigital.mjs");
const mcpServerPath = path.join(rootDir, "packages/cli/profile/src/mcp-server.mjs");
const files = fs.readdirSync(docsContentDir).filter((file) => file.endsWith(".mdx"));

if (files.length < 7) {
  throw new Error("Expected public reference docs content pages");
}

const fullText = files
  .map((file) => fs.readFileSync(path.join(docsContentDir, file), "utf8"))
  .join("\n");

for (const required of ["Portfolio Components", "Token Model", "CLI", "MCP", "Storybook Workflow", "Agent Workflow"]) {
  if (!fullText.includes(required)) {
    throw new Error(`Missing docs LLM content: ${required}`);
  }
}

const docsRegistry = fs.readFileSync(docsRegistryPath, "utf8");
const cliSlugIndex = docsRegistry.indexOf('slug: "cli"');
const mcpSlugIndex = docsRegistry.indexOf('slug: "mcp"');
const componentsSlugIndex = docsRegistry.indexOf('slug: "components"');

if (cliSlugIndex < 0 || mcpSlugIndex < 0 || componentsSlugIndex < 0) {
  throw new Error("Docs registry must include CLI, MCP, and component support pages");
}

if (cliSlugIndex > componentsSlugIndex || mcpSlugIndex > componentsSlugIndex) {
  throw new Error("Docs registry should prioritize CLI and MCP before component support docs");
}

if (!fullText.includes("https://mun.digital/llms.txt")) {
  throw new Error("Docs LLM content must cross-link to the profile/resume LLM surface");
}

const cliText = fs.readFileSync(path.join(docsContentDir, "cli.mdx"), "utf8");
const mcpText = fs.readFileSync(path.join(docsContentDir, "mcp.mdx"), "utf8");
const cliBin = fs.readFileSync(cliBinPath, "utf8");
const mcpServer = fs.readFileSync(mcpServerPath, "utf8");

const helpBlock = cliBin.match(/console\.log\(`mundigital[\s\S]*?`\);/);
if (!helpBlock) {
  throw new Error("Could not find CLI usage block");
}

const commandNames = new Set();
for (const line of helpBlock[0].split("\n")) {
  const match = line.match(/^\s+mundigital\s+([a-z]+)/);
  if (match) {
    commandNames.add(match[1]);
  }
}

if (commandNames.size === 0) {
  throw new Error("Could not parse CLI commands from usage block");
}

for (const command of commandNames) {
  if (!cliText.includes(`\`${command}`) && !cliText.includes(`mundigital ${command}`)) {
    throw new Error(`CLI docs must enumerate command: ${command}`);
  }
}

const resourceNames = [...mcpServer.matchAll(/registerResource\(\s*"([^"]+)"/g)].map((match) => match[1]);
const toolNames = [...mcpServer.matchAll(/registerTool\(\s*"([^"]+)"/g)].map((match) => match[1]);
const promptNames = [...mcpServer.matchAll(/registerPrompt\(\s*"([^"]+)"/g)].map((match) => match[1]);

if (resourceNames.length === 0) {
  throw new Error("Could not parse MCP resources from implementation");
}

if (toolNames.length === 0) {
  throw new Error("Could not parse MCP tools from implementation");
}

if (promptNames.length === 0) {
  throw new Error("Could not parse MCP prompts from implementation");
}

for (const resource of resourceNames) {
  if (!mcpText.includes(`\`${resource}\``)) {
    throw new Error(`MCP docs must enumerate resource: ${resource}`);
  }
}

for (const tool of toolNames) {
  if (!mcpText.includes(`\`${tool}\``)) {
    throw new Error(`MCP docs must enumerate tool: ${tool}`);
  }
}

for (const prompt of promptNames) {
  if (!mcpText.includes(`\`${prompt}\``)) {
    throw new Error(`MCP docs must enumerate prompt: ${prompt}`);
  }
}

console.log("docs LLM smoke passed");
