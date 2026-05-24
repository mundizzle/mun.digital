# @mun.digital/cli

Public, read-only resume CLI and MCP stdio server for [mun.digital](https://mun.digital).

For MCP clients that support Streamable HTTP, prefer the hosted no-auth endpoint:

```bash
https://mun.digital/api/mcp
```

Use this package when you need CLI access or a local stdio MCP fallback.

```bash
npx -y @mun.digital/cli profile
npx -y @mun.digital/cli search react
npx -y @mun.digital/cli brief
npx -y @mun.digital/cli mcp
```

MCP tools: `search`, `brief`, and `fetch`.

The package is generated from sanitized public profile artifacts. It does not include private profile source data.
