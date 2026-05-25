import publicLinks from "../public/raindrops.json" with { type: "json" };

export const LINKS_SCHEMA_VERSION = "1.0.0";
const RAINDROP_API_BASE_URL = "https://api.raindrop.io/rest/v1";
const RAINDROP_MAX_PAGES = 20;
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
  const normalizedConfig = normalizeRaindropConfig(config);

  return {
    schema_version: LINKS_SCHEMA_VERSION,
    links: sortLinks(
      items
        .map((item) => sanitizeRaindropItem(item, normalizedConfig))
        .filter(Boolean),
    ),
  };
}

export function sanitizeRaindropItem(item, config) {
  const collectionId = String(item?.collection?.$id ?? item?.collectionId ?? "");
  const collection = config.collections.get(collectionId);

  if (!collection) {
    return null;
  }

  const itemTags = normalizedTags(item?.tags);
  if (!hasRequiredTag(itemTags, config.requiredTags) || hasPrivateTag(itemTags, config)) {
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
    tags: itemTags,
    collection: collection.slug ?? collection.label,
    created: isoDate(item?.created),
    updated: isoDate(item?.lastUpdate ?? item?.updated),
  });
}

export async function fetchRaindropSnapshot({ token, config, fetchImpl = fetch } = {}) {
  if (!token) {
    throw new Error("RAINDROP_TOKEN is required");
  }

  const normalizedConfig = normalizeRaindropConfig(config);
  const collections = Array.from(normalizedConfig.collections.values());
  if (collections.length === 0) {
    throw new Error("At least one Raindrop collection must be configured");
  }

  const items = [];
  for (const collection of collections) {
    const collectionItems = await fetchCollectionItems({
      collectionId: stringValue(collection.id),
      collectionName: publicCollectionName(collection),
      fetchImpl,
      token,
    });
    items.push(...collectionItems);
  }

  if (items.length === 0) {
    throw new Error("Raindrop API returned no items; refusing to overwrite public artifact");
  }

  const snapshot = sanitizeRaindropItems(items, config);
  if (snapshot.links.length === 0) {
    throw new Error("Raindrop sync produced no public links; refusing to overwrite public artifact");
  }

  return snapshot;
}

export async function fetchRaindropCollections({ token, fetchImpl = fetch } = {}) {
  if (!token) {
    throw new Error("RAINDROP_TOKEN is required");
  }

  const [rootCollections, childCollections] = await Promise.all([
    fetchCollectionList({ token, fetchImpl, path: "/collections", label: "root collections" }),
    fetchCollectionList({ token, fetchImpl, path: "/collections/childrens", label: "child collections" }),
  ]);

  return [...rootCollections, ...childCollections]
    .map((collection) => ({
      id: String(collection?._id ?? ""),
      title: cleanText(collection?.title),
      count: Number.isFinite(Number(collection?.count)) ? Number(collection.count) : 0,
      public: Boolean(collection?.public),
      parentId: stringValue(collection?.parent?.$id),
    }))
    .filter((collection) => collection.id && collection.title)
    .sort((a, b) => a.title.localeCompare(b.title) || Number(a.id) - Number(b.id));
}

async function fetchCollectionList({ token, fetchImpl, path, label }) {
  const response = await fetchImpl(new URL(`${RAINDROP_API_BASE_URL}${path}`), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Raindrop API request failed for ${label}: ${response.status}`);
  }

  const body = await response.json();
  return Array.isArray(body?.items) ? body.items : [];
}

async function fetchCollectionItems({ collectionId, collectionName, fetchImpl, token }) {
  if (!collectionId) {
    throw new Error("Configured Raindrop collection is missing an id");
  }

  const items = [];
  let page = 0;

  while (page < RAINDROP_MAX_PAGES) {
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
      throw new Error(`Raindrop API request failed for ${collectionName}: ${response.status}`);
    }

    const body = await response.json();
    const pageItems = Array.isArray(body?.items) ? body.items : [];
    items.push(...pageItems);

    if (pageItems.length < RAINDROP_PER_PAGE) {
      return items;
    }

    page += 1;
  }

  throw new Error(`Raindrop API pagination exceeded ${RAINDROP_MAX_PAGES} pages for ${collectionName}`);
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

function normalizeRaindropConfig(config) {
  const privateTags = normalizedTags(config?.privateTags);
  const privateTagPrefixes = normalizedTags(config?.privateTagPrefixes);
  const requiredTags = normalizedTags(config?.requiredTags);

  return {
    collections: collectionMap(config),
    privateTags,
    privateTagPrefixes,
    requiredTags,
  };
}

function normalizedTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map(normalizeTag)
    .filter(Boolean)
    .filter((tag, index, all) => all.indexOf(tag) === index)
    .sort();
}

function collectionMap(config) {
  const map = new Map();
  for (const collection of config?.collections ?? []) {
    const id = String(collection?.id ?? "");
    validateCollectionId(id);
    const label = cleanText(collection?.label);
    const slug = cleanText(collection?.slug);

    if (id && label) {
      map.set(id, {
        id,
        label,
        slug: slug || slugify(label),
      });
    }
  }

  return map;
}

function hasRequiredTag(tags, requiredTags) {
  if (!Array.isArray(requiredTags) || requiredTags.length === 0) {
    return false;
  }

  return tags.some((tag) => requiredTags.includes(tag));
}

function hasPrivateTag(tags, config) {
  return tags.some((tag) => (
    config.privateTags.includes(tag) ||
    config.privateTagPrefixes.some((prefix) => tag.startsWith(prefix))
  ));
}

function validateCollectionId(id) {
  if (!id) {
    throw new Error("Configured Raindrop collection is missing an id");
  }

  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error(`Configured Raindrop collection id must be a positive user collection id: ${id}`);
  }
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

function normalizeTag(value) {
  return cleanText(value).toLowerCase().replace(/^#+/, "");
}

function cleanUrl(value) {
  const url = stringValue(value);
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }

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

function publicCollectionName(collection) {
  return cleanText(collection?.slug) || cleanText(collection?.label) || "configured collection";
}
