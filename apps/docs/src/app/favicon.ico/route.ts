export function GET() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect width="32" height="32" fill="#20242a"/>
      <text x="16" y="22" text-anchor="middle" font-family="monospace" font-size="18" font-weight="700" fill="#5ab8ff">m</text>
    </svg>`,
    {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
