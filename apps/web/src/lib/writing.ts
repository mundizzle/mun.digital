import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_CONTENT_DIR = path.join(process.cwd(), "content", "writing");

type MarkdownNode = {
  type?: string;
  value?: unknown;
  children?: MarkdownNode[];
};

export type WritingPost = {
  id: string;
  title: string;
  date: string;
  displayDate: string;
  pubDate: string;
  description: string;
  html: string;
};

export async function getWritingPosts(contentDir = DEFAULT_CONTENT_DIR): Promise<WritingPost[]> {
  const entries = await readMarkdownEntries(contentDir);
  const posts = await Promise.all(
    entries.map(async (entry) => readWritingPost(path.join(contentDir, entry), entry)),
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

export async function getWritingPost(id: string, contentDir = DEFAULT_CONTENT_DIR) {
  const posts = await getWritingPosts(contentDir);
  return posts.find((post) => post.id === id);
}

export function parseWritingDate(value: unknown, filename: string) {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) {
    throw new Error(`${filename} frontmatter.date must be a quoted YYYY-MM-DD string`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`${filename} frontmatter.date is not a valid calendar date`);
  }

  return date;
}

export function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

async function readMarkdownEntries(contentDir: string) {
  try {
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name);
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function readWritingPost(filePath: string, filename: string): Promise<WritingPost> {
  const source = await fs.readFile(filePath, "utf8");
  const parsed = matter(source);
  const title = parsed.data.title;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error(`${filename} frontmatter.title must be a non-empty string`);
  }

  if (parsed.content.trim().length === 0) {
    throw new Error(`${filename} must include Markdown content`);
  }

  const date = parseWritingDate(parsed.data.date, filename);
  const rendered = await remark().use(html).process(parsed.content);
  const description = extractFirstParagraph(parsed.content, filename);

  return {
    id: path.basename(filename, ".md"),
    title: title.trim(),
    date: date.toISOString().slice(0, 10),
    displayDate: formatDisplayDate(date),
    pubDate: date.toUTCString(),
    description,
    html: String(rendered),
  };
}

function extractFirstParagraph(markdown: string, filename: string) {
  const tree = remark().parse(markdown) as MarkdownNode;
  const paragraph = tree.children?.find((node) => node.type === "paragraph");
  const text = paragraph ? nodeToText(paragraph).replace(/\s+/g, " ").trim() : "";

  if (text.length === 0) {
    throw new Error(`${filename} must include a plain-text first paragraph`);
  }

  return text;
}

function nodeToText(node: MarkdownNode): string {
  if (typeof node.value === "string") {
    return node.value;
  }

  return node.children?.map(nodeToText).join("") ?? "";
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
