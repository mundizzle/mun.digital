import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsContentDir = path.join(rootDir, "apps/docs/content");
const files = fs.readdirSync(docsContentDir).filter((file) => file.endsWith(".mdx"));

if (files.length < 5) {
  throw new Error("Expected design-system docs content pages");
}

const fullText = files
  .map((file) => fs.readFileSync(path.join(docsContentDir, file), "utf8"))
  .join("\n");

for (const required of ["Token Model", "Shared UI", "Storybook Workflow", "Agent Workflow"]) {
  if (!fullText.includes(required)) {
    throw new Error(`Missing docs LLM content: ${required}`);
  }
}

if (!fullText.includes("https://mun.digital/llms.txt")) {
  throw new Error("Docs LLM content must cross-link to the profile/resume LLM surface");
}

console.log("docs LLM smoke passed");
