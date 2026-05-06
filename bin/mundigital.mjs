#!/usr/bin/env node
import { buildBrief, loadResume, profileLinks, searchResume } from "../src/profile/resume-data.mjs";
import { runStdioServer } from "../src/profile/mcp-server.mjs";

const args = process.argv.slice(2);

main(args).catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main(argv) {
  const command = argv[0];

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "profile") {
    const resume = await loadResume();
    printJsonOrText(argv, resume, renderProfile(resume));
    return;
  }

  if (command === "search") {
    const query = argv.filter((arg) => arg !== "--json").slice(1).join(" ");
    if (!query.trim()) {
      throw new Error('Usage: mundigital search <query> [--json]');
    }

    const result = await searchResume(query);
    printJsonOrText(argv, result, renderSearch(result));
    return;
  }

  if (command === "brief") {
    const brief = await buildBrief();
    if (argv.includes("--json")) {
      const resume = await loadResume();
      printJson({
        schema_version: resume.schema_version,
        brief,
      });
      return;
    }

    console.log(brief);
    return;
  }

  if (command === "mcp") {
    await runStdioServer();
    return;
  }

  if (command === "--json") {
    const resume = await loadResume();
    printJson(resume);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

function printJsonOrText(argv, data, text) {
  if (argv.includes("--json")) {
    printJson(data);
    return;
  }

  console.log(text);
}

function printJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

function renderProfile(resume) {
  const skills = resume.skills
    ?.map((group) => `${group.name}: ${group.keywords.join(", ")}`)
    .join("\n");
  const profiles = profileLinks(resume).join("\n");

  return [
    `${resume.basics.name} - ${resume.basics.label}`,
    "",
    resume.basics.summary,
    "",
    "Profiles",
    profiles,
    "",
    skills,
  ]
    .filter(Boolean)
    .join("\n");
}

function renderSearch(result) {
  if (result.results.length === 0) {
    return `No public resume evidence found for "${result.query}".`;
  }

  return result.results
    .map((entry) => `[${entry.section}] ${entry.text}`)
    .join("\n\n");
}

function printHelp() {
  console.log(`mundigital

Usage:
  mundigital profile [--json]
  mundigital search <query> [--json]
  mundigital brief [--json]
  mundigital mcp
`);
}
