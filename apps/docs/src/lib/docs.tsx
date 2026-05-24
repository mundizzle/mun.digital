import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  file: string;
}

export const docPages: DocPage[] = [
  {
    slug: "tokens",
    title: "Token Model",
    description: "How design.tokens.json becomes shared semantic CSS.",
    file: "tokens.mdx",
  },
  {
    slug: "components",
    title: "Shared UI",
    description: "Rules for reusable, data-agnostic components.",
    file: "components.mdx",
  },
  {
    slug: "architecture",
    title: "Architecture",
    description: "Workspace boundaries for web, docs, Storybook, tokens, and UI.",
    file: "architecture.mdx",
  },
  {
    slug: "storybook",
    title: "Storybook Workflow",
    description: "Local workbench, accessibility posture, MSW, and MCP boundaries.",
    file: "storybook.mdx",
  },
  {
    slug: "agent-workflow",
    title: "Agent Workflow",
    description: "How agents should extend the design system safely.",
    file: "agent-workflow.mdx",
  },
];

const contentDir = path.join(process.cwd(), "content");

export function getPage(slug: string) {
  return docPages.find((page) => page.slug === slug);
}

export function readPageMarkdown(page: DocPage) {
  return fs.readFileSync(path.join(contentDir, page.file), "utf8").trim();
}

export function docsLlmsTxt() {
  return [
    "# mun.digital Design System",
    "",
    "> Design-system documentation for tokens, shared UI, Storybook, and agent workflows.",
    "",
    "Primary docs: https://docs.mun.digital",
    "Profile/resume LLM surface: https://mun.digital/llms.txt",
    "",
    "## Pages",
    ...docPages.map((page) => `- [${page.title}](https://docs.mun.digital/${page.slug}) - ${page.description}`),
    "",
    "This docs LLM surface is design-system-only and does not replace the profile/resume LLM surface.",
  ].join("\n");
}

export function docsLlmsFullTxt() {
  return [
    docsLlmsTxt(),
    "",
    "## Full Documentation",
    ...docPages.flatMap((page) => [
      "",
      `### ${page.title}`,
      "",
      readPageMarkdown(page),
    ]),
  ].join("\n");
}

function inlineMarkdown(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return (
        <code className="rounded border border-border bg-card px-1 py-0.5 font-mono text-[0.92em]" key={index}>
          {codeMatch[1]}
        </code>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a className="text-primary underline underline-offset-4" href={linkMatch[2]} key={index}>
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}

export function renderMarkdown(markdown: string) {
  const blocks: ReactNode[] = [];
  const lines = markdown.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!line.trim()) {
      continue;
    }

    if (line.startsWith("# ")) {
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 className="mt-8 mb-3 font-mono text-xl leading-tight font-semibold" key={index}>
          {line.slice(3)}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      let cursor = index;
      while (cursor < lines.length && lines[cursor].startsWith("- ")) {
        items.push(lines[cursor].slice(2));
        cursor += 1;
      }
      index = cursor - 1;
      blocks.push(
        <ul className="my-4 grid list-none gap-2 p-0" key={index}>
          {items.map((item) => (
            <li className="relative pl-5 before:absolute before:left-0 before:text-primary before:content-['-']" key={item}>
              {inlineMarkdown(item)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    blocks.push(
      <p className="my-4 max-w-[76ch] text-[15px] leading-7 text-foreground" key={index}>
        {inlineMarkdown(line)}
      </p>,
    );
  }

  return blocks;
}
