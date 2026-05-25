import raindrops from "../../public/raindrops.json";

type PublicLink = (typeof raindrops.links)[number];

export type ReadingLink = {
  id: string;
  title: string;
  href: string;
  domain: string;
  note?: string;
  tags: string[];
};

export const readingLinks: ReadingLink[] = raindrops.links.slice(0, 12).map(toReadingLink);

function toReadingLink(link: PublicLink): ReadingLink {
  return {
    id: link.id,
    title: link.title,
    href: link.url,
    domain: domainFor(link.url),
    note: link.excerpt || undefined,
    tags: tagsFor(link),
  };
}

function tagsFor(link: PublicLink) {
  const tags = [labelForCollection(link.collection), ...link.tags]
    .filter((tag) => tag !== "mun.digital")
    .map((tag) => tag.toUpperCase());

  return [...new Set(tags)].slice(0, 2);
}

function labelForCollection(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function domainFor(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
