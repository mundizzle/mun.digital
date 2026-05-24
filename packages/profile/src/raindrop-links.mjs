import publicLinks from "../public/raindrops.json" with { type: "json" };

export const LINKS_SCHEMA_VERSION = "1.0.0";
const RAINDROP_API_BASE_URL = "https://api.raindrop.io/rest/v1";
const RAINDROP_PER_PAGE = 50;

let cachedLinks;

export async function loadLinks() {
  if (!cachedLinks) {
    cachedLinks = sanitizeLinkSnapshot(publicLinks);
  }

  return cachedLinks;
}

export async function searchLinks(query, options = {}) {
  const normalizedQuery = String(query ?? "").trim().toLowerCase();
  const limit = Number.isInteger(options.limit) ? options.limit : 8;

  if (!normalizedQuery) {
    return {
      schema_version: LINKS_SCHEMA_VERSION,
      query: "",
      count: 0,
      results: [],
    };
  }

  const snapshot = await loadLinks();
  const results = searchLinkEntries(snapshot.links, normalizedQuery, limit).map((link) => ({
    id: link.id,
    title: link.title,
    url: link.url,
    excerpt: link.excerpt,
    tags: link.tags,
    collection: link.collection,
    created: link.created,
    updated: link.updated,
  }));

  return {
    schema_version: snapshot.schema_version ?? LINKS_SCHEMA_VERSION,
    query,
    count: results.length,
    results,
  };
}

export async function fetchLink(id) {
  const normalizedId = String(id ?? "").trim();
  const snapshot = await loadLinks();
  const link = snapshot.links.find((entry) => entry.id === normalizedId);

  if (!link) {
    throw new Error(`No public link found for id: ${normalizedId}`);
  }

  return link;
}

export function sanitizeLinkSnapshot(value) {
  const links = Array.isArray(value?.links) ? value.links.map(sanitizePublicLink).filter(Boolean) : [];

  return {
    schema_version: LINKS_SCHEMA_VERSION,
    links: sortLinks(links),
  };
}

export function sanitizeRaindropItems(items, config) {
  const collections = collectionMap(config);

  return {
    schema_version: LINKS_SCHEMA_VERSION,
    links: sortLinks(
      items
        .map((item) => sanitizeRaindropItem(item, collections, config))
        .filter(Boolean),
    ),
  };
}

export function sanitizeRaindropItem(item, collections, config) {
  const collectionId = String(item?.collection?.$id ?? item?.collectionId ?? "");
  const collection = collections.get(collectionId);

  if (!collection) {
    return null;
  }

  const id = stringValue(item?._id);
  const title = cleanText(item?.title);
  const url = cleanUrl(item?.link);

  if (!id || !title || !url) {
    return null;
  }

  return sanitizePublicLink({
    id,
    title,
    url,
    excerpt: cleanText(item?.excerpt),
    tags: publicTags(item?.tags, config),
    collection: collection.slug ?? collection.label,
    created: isoDate(item?.created),
    updated: isoDate(item?.lastUpdate ?? item?.updated),
  });
}

export async function fetchRaindropSnapshot({ token, config, fetchImpl = fetch } = {}) {
  if (!token) {
    throw new Error("RAINDROP_TOKEN is required");
  }

  const collections = Array.isArray(config?.collections) ? config.collections : [];
  if (collections.length === 0) {
    throw new Error("At least one Raindrop collection must be configured");
  }

  const items = [];
  for (const collection of collections) {
    const collectionItems = await fetchCollectionItems({
      collectionId: collection.id,
      fetchImpl,
      token,
    });
    items.push(...collectionItems);
  }

  if (items.length === 0) {
    throw new Error("Raindrop API returned no items; refusing to overwrite public artifact");
  }

  return sanitizeRaindropItems(items, config);
}

async function fetchCollectionItems({ collectionId, fetchImpl, token }) {
  const items = [];
  let page = 0;

  while (true) {
    const url = new URL(`${RAINDROP_API_BASE_URL}/raindrops/${encodeURIComponent(collectionId)}`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("perpage", String(RAINDROP_PER_PAGE));
    url.searchParams.set("sort", "-created");

    const response = await fetchImpl(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Raindrop API request failed for collection ${collectionId}: ${response.status}`);
    }

    const body = await response.json();
    const pageItems = Array.isArray(body?.items) ? body.items : [];
    items.push(...pageItems);

    if (pageItems.length < RAINDROP_PER_PAGE) {
      break;
    }

    page += 1;
  }

  return items;
}

function sanitizePublicLink(link) {
  const id = stringValue(link?.id);
  const title = cleanText(link?.title);
  const url = cleanUrl(link?.url);
  const collection = cleanText(link?.collection);

  if (!id || !title || !url || !collection) {
    return null;
  }

  return {
    id,
    title,
    url,
    excerpt: cleanText(link?.excerpt),
    tags: Array.isArray(link?.tags) ? [...new Set(link.tags.map(cleanText).filter(Boolean))].sort() : [],
    collection,
    created: isoDate(link?.created),
    updated: isoDate(link?.updated),
  };
}

function searchLinkEntries(links, normalizedQuery, limit) {
  return links
    .map((link) => ({
      ...link,
      score: scoreLink(link, normalizedQuery),
    }))
    .filter((link) => link.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

function scoreLink(link, query) {
  const haystack = [
    link.title,
    link.url,
    link.excerpt,
    link.collection,
    ...(link.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (haystack.includes(query)) {
    return 100 + query.length;
  }

  const terms = query.split(/\s+/).filter(Boolean);
  return terms.reduce((score, term) => (haystack.includes(term) ? score + 10 : score), 0);
}

function publicTags(tags, config) {
  if (!Array.isArray(tags)) {
    return [];
  }

  const privateTags = new Set((config?.privateTags ?? []).map((tag) => String(tag).toLowerCase()));
  const privatePrefixes = (config?.privateTagPrefixes ?? []).map(String);

  return tags
    .map(cleanText)
    .filter(Boolean)
    .filter((tag) => {
      const lowerTag = tag.toLowerCase();
      return !privateTags.has(lowerTag) && !privatePrefixes.some((prefix) => tag.startsWith(prefix));
    })
    .sort();
}

function collectionMap(config) {
  const map = new Map();
  for (const collection of config?.collections ?? []) {
    const id = String(collection?.id ?? "");
    const label = cleanText(collection?.label);
    const slug = cleanText(collection?.slug);

    if (id && label) {
      map.set(id, {
        label,
        slug: slug || slugify(label),
      });
    }
  }

  return map;
}

function sortLinks(links) {
  return [...links].sort((a, b) => (
    String(b.created ?? "").localeCompare(String(a.created ?? "")) ||
    a.id.localeCompare(b.id)
  ));
}

function stringValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function cleanText(value) {
  return stringValue(value).replace(/\s+/g, " ");
}

function cleanUrl(value) {
  const url = stringValue(value);
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch {
    return "";
  }
}

function isoDate(value) {
  const raw = stringValue(value);
  if (!raw) {
    return "";
  }

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
