import type { WritingPost } from "./writing";

const SITE_URL = "https://mun.digital";
const FEED_URL = `${SITE_URL}/rss.xml`;

export function buildWritingRss(posts: readonly WritingPost[]) {
  const items = posts.map((post) => {
    const url = `${SITE_URL}/writing/${post.id}`;

    return [
      "    <item>",
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${post.pubDate}</pubDate>`,
      `      <description>${escapeXml(post.description)}</description>`,
      `      <content:encoded><![CDATA[${escapeCdata(post.html)}]]></content:encoded>`,
      "    </item>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    "  <channel>",
    "    <title>mun.digital Writing</title>",
    `    <link>${SITE_URL}/writing</link>`,
    "    <description>Writing by Mundi Morgado.</description>",
    "    <language>en-us</language>",
    `    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function escapeCdata(value: string) {
  return value.replaceAll("]]>", "]]]]><![CDATA[>");
}
