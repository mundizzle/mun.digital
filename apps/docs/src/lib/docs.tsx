import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { tokenMetadata } from "@mun.digital/tokens/metadata";

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  file: string;
}

export const docPages: DocPage[] = [
  {
    slug: "cli",
    title: "CLI",
    description: "How to use the read-only mundigital command-line interface.",
    file: "cli.mdx",
  },
  {
    slug: "mcp",
    title: "MCP",
    description: "Hosted and local access to the read-only mundigital MCP server.",
    file: "mcp.mdx",
  },
  {
    slug: "architecture",
    title: "Architecture",
    description: "Workspace boundaries for web, docs, Storybook, packages, CLI, and MCP.",
    file: "architecture.mdx",
  },
  {
    slug: "agent-workflow",
    title: "Agent Workflow",
    description: "How agents should extend public reference surfaces safely.",
    file: "agent-workflow.mdx",
  },
  {
    slug: "tokens",
    title: "Token Model",
    description: "How design.tokens.json becomes shared semantic CSS.",
    file: "tokens.mdx",
  },
  {
    slug: "components",
    title: "Portfolio Components",
    description: "Supporting notes for app-owned components documented in Storybook.",
    file: "components.mdx",
  },
  {
    slug: "storybook",
    title: "Storybook Workflow",
    description: "App component workbench, token reference, and visual test evidence.",
    file: "storybook.mdx",
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
    "# mun.digital Public Reference",
    "",
    "> Public reference documentation for the read-only mundigital MCP server and CLI, with supporting architecture, workflow, token, and Storybook notes.",
    "",
    "Primary docs: https://docs.mun.digital",
    "Profile/resume LLM surface: https://mun.digital/llms.txt",
    "",
    "## Pages",
    ...docPages.map((page) => `- [${page.title}](https://docs.mun.digital/${page.slug}) - ${page.description}`),
    "",
    "Use MCP or CLI for structured public profile evidence. Use the separate profile/resume LLM surface for profile facts.",
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
      ...(page.slug === "tokens" ? ["", tokenReferenceMarkdown()] : []),
    ]),
  ].join("\n");
}

export function tokenReferenceMarkdown() {
  const rows = tokenMetadata.tokens.map((token) =>
    [
      `\`${token.cssVariable}\``,
      token.category,
      token.mode ?? "-",
      `\`${token.resolvedValue}\``,
      `\`${token.sourcePath}\``,
    ].join(" | "),
  );

  return [
    "## Generated Token Reference",
    "",
    "| CSS variable | Category | Mode | Resolved value | Source path |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row} |`),
  ].join("\n");
}

export function renderMarkdown(markdown: string) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: () => null,
        h2: ({ children }) => <h2 className="mt-8 mb-3 font-mono text-xl leading-tight font-semibold">{children}</h2>,
        h3: ({ children }) => <h3 className="mt-6 mb-2 font-mono text-base leading-tight font-semibold">{children}</h3>,
        p: ({ children }) => <p className="my-4 max-w-[76ch] text-[15px] leading-7 text-foreground">{children}</p>,
        a: ({ children, href }) => (
          <a className="text-primary underline underline-offset-4" href={href}>
            {children}
          </a>
        ),
        ul: ({ children }) => <ul className="my-4 grid list-none gap-2 p-0">{children}</ul>,
        ol: ({ children }) => <ol className="my-4 grid gap-2 pl-6">{children}</ol>,
        li: ({ children }) => (
          <li className="relative pl-5 before:absolute before:left-0 before:text-primary before:content-['-']">{children}</li>
        ),
        code: ({ children, className }) => {
          const isBlock = Boolean(className);
          if (isBlock) {
            return <code className={`${className} font-mono text-[0.92em]`}>{children}</code>;
          }
          return (
            <code className="rounded border border-border bg-card px-1 py-0.5 font-mono text-[0.92em]">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="my-5 max-w-full overflow-x-auto border border-border bg-card p-4 text-sm leading-6">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="my-5 max-w-full overflow-x-auto border border-border">
            <table className="w-full border-collapse text-left text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border-b border-border bg-card px-3 py-2 font-mono text-xs text-foreground uppercase">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="border-b border-border px-3 py-2 align-top">{children}</td>,
        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

export function TokenReference() {
  const colorTokens = tokenMetadata.tokens.filter((token) => token.category === "Colors");
  const layoutTokens = tokenMetadata.tokens.filter((token) => token.category === "Layout");

  return (
    <section className="mt-10" aria-labelledby="generated-token-reference">
      <h2 className="mt-8 mb-3 font-mono text-xl leading-tight font-semibold" id="generated-token-reference">
        Generated Token Reference
      </h2>
      <p className="my-4 max-w-[76ch] text-[15px] leading-7 text-foreground">
        This reference is rendered from <code className="rounded border border-border bg-card px-1 py-0.5 font-mono text-[0.92em]">@mun.digital/tokens/metadata</code>, the generated metadata companion to the canonical CSS export.
      </p>
      <TokenTable caption="Semantic color tokens" tokens={colorTokens} />
      <TokenTable caption="Layout tokens" tokens={layoutTokens} />
    </section>
  );
}

function TokenTable({
  caption,
  tokens,
}: {
  caption: string;
  tokens: typeof tokenMetadata.tokens;
}) {
  return (
    <div className="my-5 max-w-full overflow-x-auto border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th className="border-b border-border bg-card px-3 py-2 font-mono text-xs text-foreground uppercase" scope="col">
              Token
            </th>
            <th className="border-b border-border bg-card px-3 py-2 font-mono text-xs text-foreground uppercase" scope="col">
              Mode
            </th>
            <th className="border-b border-border bg-card px-3 py-2 font-mono text-xs text-foreground uppercase" scope="col">
              Value
            </th>
            <th className="border-b border-border bg-card px-3 py-2 font-mono text-xs text-foreground uppercase" scope="col">
              Source
            </th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={`${token.name}-${token.mode ?? "base"}`}>
              <td className="border-b border-border px-3 py-2 align-top">
                <div className="flex items-center gap-2">
                  {token.type === "color" ? (
                    <span
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 border border-border"
                      style={{ background: token.resolvedValue }}
                    />
                  ) : null}
                  <code className="rounded border border-border bg-card px-1 py-0.5 font-mono text-[0.92em]">
                    {token.cssVariable}
                  </code>
                </div>
              </td>
              <td className="border-b border-border px-3 py-2 align-top">{token.mode ?? "base"}</td>
              <td className="border-b border-border px-3 py-2 align-top">
                <code className="rounded border border-border bg-card px-1 py-0.5 font-mono text-[0.92em]">
                  {token.resolvedValue}
                </code>
              </td>
              <td className="border-b border-border px-3 py-2 align-top">
                <code className="rounded border border-border bg-card px-1 py-0.5 font-mono text-[0.92em]">
                  {token.sourcePath}
                </code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
