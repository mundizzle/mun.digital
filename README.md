# mun.digital

Public, read-only professional profile for Mundi Morgado at [mun.digital](https://mun.digital).

The same sanitized resume data powers the website, generated resume artifacts, CLI, and MCP server.

## Connect from your LLM

Canonical server name: `mundigital` (one word, no space, no hyphen).

The recommended MCP connection is the hosted Streamable HTTP endpoint:

```bash
https://mun.digital/api/mcp
```

This endpoint is public, read-only, and does not require authentication. It exposes `search`, `brief`, and `fetch` tools for LLM clients, plus a resume resource and portfolio prompt for clients that support MCP resources and prompts.

Claude Code:

```bash
claude mcp add --transport http mundigital https://mun.digital/api/mcp
```

Codex:

```bash
codex mcp add mundigital --url https://mun.digital/api/mcp
```

ChatGPT / OpenAI custom connector:

- Add a remote MCP connector named `mundigital`.
- Use URL `https://mun.digital/api/mcp`.
- Use no authentication.
- Available tools are `search`, `brief`, and `fetch`.

For local stdio fallback, run the npm package directly:

```bash
claude mcp add --transport stdio mundigital -- npx -y @mun.digital/cli mcp
```

Claude Desktop local stdio configuration:

```json
{
  "mcpServers": {
    "mundigital": {
      "command": "npx",
      "args": ["-y", "@mun.digital/cli", "mcp"]
    }
  }
}
```

Other MCP clients use analogous stdio or Streamable HTTP configuration. The hosted endpoint should be the default unless the client only supports stdio or you are debugging local package behavior.

## CLI

Run the public profile tools without installing:

```bash
npx -y @mun.digital/cli profile
npx -y @mun.digital/cli search react
npx -y @mun.digital/cli brief
npx -y @mun.digital/cli mcp
```

| Command                               | Purpose                                                                                                                                                                      |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npx -y @mun.digital/cli profile`        | Prints the public sanitized profile summary, links, and skills.                                                                                                              |
| `npx -y @mun.digital/cli search <query>` | Searches public resume evidence for a topic, keyword, company, or technology.                                                                                                |
| `npx -y @mun.digital/cli brief`          | Prints an agent-ready career brief with selected work evidence.                                                                                                              |
| `npx -y @mun.digital/cli mcp`            | Starts the local stdio MCP server for MCP clients. This is intended to be launched by tools such as Claude Desktop or Claude Code, not run directly in an interactive shell. |

Most commands also support `--json` for agent and script workflows:

```bash
npx -y @mun.digital/cli profile --json
npx -y @mun.digital/cli search "design systems" --json
npx -y @mun.digital/cli brief --json
```

Example fit checks:

```bash
# Does Mundi have Rails experience?
npx -y @mun.digital/cli search rails
```

Example Rails output:

```text
[Principal Front-End Engineer, Gierd] Introduced agentic development practices for a 20-engineer team, including agent instructions and review standards that improved consistency in Rails view code, design-system adoption, and UI PR quality.

[Principal Front-End Engineer, Gierd] Co-created the Gierd Design System, with 20+ reusable components implemented as Rails view helpers and adopted as the canonical UI foundation for the product platform.
```

Example endorsement questions:

```bash
npx -y @mun.digital/cli search "what do people say about Mundi?"
npx -y @mun.digital/cli search endorsements
```

Example endorsement output:

```text
[Endorsement: Marlo Stewart] Marlo Stewart, Engineering Chief of Staff, Project & Strategic Program Leader, Gierd: Mundi is an exceptional front-end developer who consistently delivers high-quality work. He combines strong technical skill with a great eye for user experience, communicates clearly, takes ownership, and is the kind of teammate any team would be lucky to have.

[Endorsement: Robert Evans] Robert Evans, Chief Technology Officer, Gierd: Mundi is one of the nicest engineers out there who is also amazingly smart, talented, and efficient.
```

Other useful searches:

```bash
npx -y @mun.digital/cli search accessibility
npx -y @mun.digital/cli search "design systems"
npx -y @mun.digital/cli search endorsements
npx -y @mun.digital/cli search "technical leadership"
```

Or install it globally:

```bash
npm install -g @mun.digital/cli
mundigital profile
```

## Website

- Site: [mun.digital](https://mun.digital)
- Agent discovery: [mun.digital/llms.txt](https://mun.digital/llms.txt)
- JSON: [mun.digital/resume.json](https://mun.digital/resume.json)
- Markdown: [mun.digital/resume.md](https://mun.digital/resume.md)
- PDF: [mun.digital/mundi-morgado-resume.pdf](https://mun.digital/mundi-morgado-resume.pdf)
- GitHub: [github.com/mundizzle](https://github.com/mundizzle)

Agents can request the homepage as Markdown with HTTP content negotiation:

```bash
curl -H "Accept: text/markdown" https://mun.digital/
```

## Data boundary

Public surfaces exclude private contact details and private metadata. CLI and MCP output are read-only; they do not expose write, deploy, shell, filesystem, environment, secret, telemetry, or postinstall behavior.

## Tech

pnpm workspace with a Next.js App Router web app, TypeScript, Tailwind CSS, and shared profile logic, deployed on Vercel.

## Local development

```bash
pnpm install
pnpm run resume:build
pnpm run dev   # http://localhost:3000
```

## Verification

```bash
pnpm run resume:build
pnpm run public:smoke
pnpm run llms:smoke
pnpm run profile:smoke
pnpm run mcp:smoke
pnpm run mcp:http:smoke https://mun.digital/api/mcp
pnpm run lint
pnpm run build
pnpm run pack:smoke
```

## Agent context

See [`AGENTS.md`](./AGENTS.md) for project state, deployment flow, DNS, and decision log.
