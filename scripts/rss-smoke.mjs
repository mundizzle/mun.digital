import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const origin = process.argv[2] ?? "http://localhost:3000";
const rootDir = path.resolve(import.meta.dirname, "..");
const contentDir = path.join(rootDir, "apps/web/content/writing");

const [rssResponse, rootResponse] = await Promise.all([
  fetch(new URL("/rss.xml", origin)),
  fetch(new URL("/", origin)),
]);

assert(rssResponse.ok, `/rss.xml returned ${rssResponse.status}`);
assert(rootResponse.ok, `/ returned ${rootResponse.status}`);

const contentType = rssResponse.headers.get("content-type") ?? "";
assert(
  contentType.includes("application/rss+xml") && contentType.includes("charset=utf-8"),
  `/rss.xml returned unexpected content-type: ${contentType}`,
);

const rss = await rssResponse.text();
const rootHtml = await rootResponse.text();
const xmllint = spawnSync("xmllint", ["--noout", "-"], { input: rss, encoding: "utf8" });
assert(xmllint.status === 0, `rss.xml is not well-formed XML: ${xmllint.stderr}`);

const postCount = (await fs.readdir(contentDir)).filter((filename) => filename.endsWith(".md")).length;
const items = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1] ?? "");
assert(items.length === postCount, `rss item count ${items.length} did not match Markdown post count ${postCount}`);
assert(rss.includes('xmlns:atom="http://www.w3.org/2005/Atom"'), "rss missing atom namespace");
assert(rss.includes('xmlns:content="http://purl.org/rss/1.0/modules/content/"'), "rss missing content namespace");
assert(
  rss.includes('<atom:link href="https://mun.digital/rss.xml" rel="self" type="application/rss+xml" />'),
  "rss missing atom self link",
);

for (const item of items) {
  const link = textFor(item, "link");
  const pubDate = textFor(item, "pubDate");

  assert(link.startsWith("https://mun.digital/writing/"), `rss item link is not absolute: ${link}`);
  assert(new Date(pubDate).toUTCString() === pubDate, `rss item pubDate is not RFC-822 UTC: ${pubDate}`);
  assert(item.includes("<content:encoded><![CDATA["), "rss item missing content:encoded CDATA");
}

assert(
  rootHtml.includes('rel="alternate"') &&
    rootHtml.includes('type="application/rss+xml"') &&
    rootHtml.includes('title="mun.digital Writing"') &&
    rootHtml.includes('href="/rss.xml"'),
  "root HTML missing RSS alternate link",
);
assert(rootHtml.includes('href="/rss.xml"') && rootHtml.includes(">RSS<"), "footer RSS link does not point to /rss.xml");

console.log("rss smoke passed");

function textFor(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`));
  assert(match, `rss item missing ${tagName}`);
  return decodeXml(match[1].trim());
}

function decodeXml(value) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
