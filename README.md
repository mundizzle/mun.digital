# mun.digital

Public, read-only professional profile for Mundi Morgado at [mun.digital](https://mun.digital).

The same sanitized resume data powers the website, generated resume artifacts, CLI, and MCP server.

## MCP

The hosted MCP endpoint exposes read-only, sanitized resume data:

```bash
https://mun.digital/api/mcp
```

Claude Code can connect to the hosted Streamable HTTP server:

```bash
claude mcp add --transport http mundigital https://mun.digital/api/mcp
```

For local stdio, run the npm package directly:

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

Other MCP clients use analogous stdio or Streamable HTTP configuration. This MCP is public, read-only, and intentionally limited to sanitized professional profile data.

## CLI

```bash
npx @mun.digital/cli profile
npx @mun.digital/cli search react
npx @mun.digital/cli brief
npx @mun.digital/cli mcp
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

Agents can request the homepage as Markdown with HTTP content negotiation:

```bash
curl -H "Accept: text/markdown" https://mun.digital/
```

## Data boundary

Public surfaces exclude private contact details and private metadata. CLI and MCP output are read-only; they do not expose write, deploy, shell, filesystem, environment, secret, telemetry, or postinstall behavior.

## Tech

Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel.

## Local development

```bash
npm install
npm run resume:build
npm run dev   # http://localhost:3000
```

## Verification

```bash
npm run resume:build
npm run public:smoke
npm run llms:smoke
npm run profile:smoke
npm run mcp:smoke
npm run mcp:http:smoke -- https://mun.digital/api/mcp
npm run lint
npm run build
npm run pack:smoke
```

## Agent context

See [`AGENTS.md`](./AGENTS.md) for project state, deployment flow, DNS, and decision log.
