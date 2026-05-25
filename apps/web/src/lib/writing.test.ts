import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildWritingRss } from "./rss";
import { getWritingPosts } from "./writing";

let tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => fs.rm(dir, { recursive: true, force: true })));
  tempDirs = [];
});

describe("writing loader", () => {
  it("parses title and date, derives slug, sorts newest first, and extracts the first paragraph", async () => {
    const dir = await createContentDir({
      "older-post.md": markdown("Older post", "2025-01-02", "Older first paragraph."),
      "newer-post.md": markdown("Newer post", "2026-05-25", "Newer first paragraph."),
    });

    const posts = await getWritingPosts(dir);

    expect(posts.map((post) => post.id)).toEqual(["newer-post", "older-post"]);
    expect(posts[0]).toMatchObject({
      title: "Newer post",
      date: "2026-05-25",
      displayDate: "May 25, 2026",
      pubDate: "Mon, 25 May 2026 00:00:00 GMT",
      description: "Newer first paragraph.",
    });
    expect(posts[0]?.html).toContain("<p>Newer first paragraph.</p>");
  });

  it("rejects missing title frontmatter", async () => {
    const dir = await createContentDir({
      "missing-title.md": "---\ndate: \"2026-05-25\"\n---\n\nBody.",
    });

    await expect(getWritingPosts(dir)).rejects.toThrow("frontmatter.title");
  });

  it("rejects missing, unquoted, or malformed date frontmatter", async () => {
    const missingDate = await createContentDir({
      "missing-date.md": "---\ntitle: \"Missing date\"\n---\n\nBody.",
    });
    const unquotedDate = await createContentDir({
      "unquoted-date.md": "---\ntitle: \"Unquoted date\"\ndate: 2026-05-25\n---\n\nBody.",
    });
    const malformedDate = await createContentDir({
      "malformed-date.md": "---\ntitle: \"Bad date\"\ndate: \"2026-02-31\"\n---\n\nBody.",
    });

    await expect(getWritingPosts(missingDate)).rejects.toThrow("frontmatter.date");
    await expect(getWritingPosts(unquotedDate)).rejects.toThrow("frontmatter.date");
    await expect(getWritingPosts(malformedDate)).rejects.toThrow("valid calendar date");
  });

  it("builds RSS with absolute links, RFC-822 dates, namespaces, and escaped text", async () => {
    const dir = await createContentDir({
      "feed-post.md": markdown("Feed & post", "2026-05-25", "One <two> & three."),
    });
    const posts = await getWritingPosts(dir);
    const rss = buildWritingRss(posts);

    expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
    expect(rss).toContain('<atom:link href="https://mun.digital/rss.xml" rel="self" type="application/rss+xml" />');
    expect(rss).toContain("<link>https://mun.digital/writing/feed-post</link>");
    expect(rss).toContain("<pubDate>Mon, 25 May 2026 00:00:00 GMT</pubDate>");
    expect(rss).toContain("<title>Feed &amp; post</title>");
    expect(rss).toContain("<description>One &lt;two&gt; &amp; three.</description>");
    expect(rss).toContain("<content:encoded><![CDATA[");
  });
});

async function createContentDir(files: Record<string, string>) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "mun-writing-"));
  tempDirs.push(dir);

  await Promise.all(
    Object.entries(files).map(([filename, content]) => fs.writeFile(path.join(dir, filename), content)),
  );

  return dir;
}

function markdown(title: string, date: string, body: string) {
  return `---\ntitle: "${title}"\ndate: "${date}"\n---\n\n${body}\n\nSecond paragraph.`;
}
