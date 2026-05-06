# mun.digital

Public, read-only professional profile for Mundi Morgado at [mun.digital](https://mun.digital).

The same sanitized resume data powers the website, generated resume artifacts, CLI, and MCP server.

## Tech

Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel.

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
mun-digital profile
```

## Public artifacts

- JSON: [mun.digital/resume.json](https://mun.digital/resume.json)
- Markdown: [mun.digital/resume.md](https://mun.digital/resume.md)
- PDF: [mun.digital/resume.pdf](https://mun.digital/resume.pdf)

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
npm run profile:smoke
npm run mcp:smoke
npm run lint
npm run build
npm run pack:smoke
```

## Agent context

See [`AGENTS.md`](./AGENTS.md) for project state, deployment flow, DNS, and decision log.
