import publicResume from "../public/resume.json" with { type: "json" };

import { sanitizeResume, SCHEMA_VERSION } from "./sanitize-resume.mjs";

let cachedResume;

export async function loadResume() {
  if (!cachedResume) {
    cachedResume = sanitizeResume(publicResume);
  }

  return cachedResume;
}

export async function searchResume(query, options = {}) {
  const normalizedQuery = String(query ?? "").trim().toLowerCase();
  const limit = Number.isInteger(options.limit) ? options.limit : 8;

  if (!normalizedQuery) {
    return {
      schema_version: SCHEMA_VERSION,
      query: "",
      count: 0,
      results: [],
    };
  }

  const resume = await loadResume();
  const matches = searchEvidence(resume, normalizedQuery, limit)
    .map((entry) => ({
      path: entry.path,
      section: entry.section,
      text: entry.text,
    }));

  return {
    schema_version: resume.schema_version ?? SCHEMA_VERSION,
    query,
    count: matches.length,
    results: matches,
  };
}

export async function searchMcpEvidence(query, options = {}) {
  const normalizedQuery = String(query ?? "").trim().toLowerCase();
  const limit = Number.isInteger(options.limit) ? options.limit : 8;

  if (!normalizedQuery) {
    return {
      results: [],
    };
  }

  const resume = await loadResume();
  const matches = searchEvidence(resume, normalizedQuery, limit).map((entry) => ({
    id: entry.id,
    title: entry.section,
    text: entry.text,
    url: entry.url,
  }));

  return {
    results: matches,
  };
}

export async function fetchMcpEvidence(id) {
  const normalizedId = String(id ?? "").trim();
  const resume = await loadResume();
  const evidence = collectEvidence(resume);
  const entry = evidence.find((item) => item.id === normalizedId);

  if (!entry) {
    throw new Error(`No public resume evidence found for id: ${normalizedId}`);
  }

  return {
    id: entry.id,
    title: entry.section,
    text: entry.text,
    url: entry.url,
    metadata: {
      path: entry.path,
      source: "mun.digital public resume",
    },
  };
}

export async function buildBrief() {
  const resume = await loadResume();
  const skills = resume.skills
    ?.map((group) => `${group.name}: ${group.keywords.join(", ")}`)
    .join("\n");
  const profiles = profileLinks(resume).join("\n");
  const highlights = resume.work
    ?.slice(0, 3)
    .map((job) => {
      const firstHighlight = job.highlights?.[0] ? ` ${job.highlights[0]}` : "";
      return `${job.position}, ${job.name}: ${job.summary}${firstHighlight}`;
    })
    .join("\n");

  return [
    `${resume.basics.name} - ${resume.basics.label}`,
    "",
    resume.basics.summary,
    "",
    "Profiles",
    profiles,
    "",
    "Skills",
    skills,
    "",
    "Selected Evidence",
    highlights,
  ]
    .filter(Boolean)
    .join("\n");
}

function collectEvidence(resume) {
  const entries = [];

  add(entries, "summary", "basics.summary", "Summary", resume.basics?.summary);

  for (const [index, profile] of (resume.basics?.profiles ?? []).entries()) {
    add(
      entries,
      `profile-${slug(profile.network ?? profile.username ?? index)}`,
      `basics.profiles.${index}`,
      `Profile: ${profile.network ?? profile.username ?? index}`,
      [profile.network, profile.username, profile.url].filter(Boolean).join(" - "),
      [],
      profile.url,
    );
  }

  for (const skill of resume.skills ?? []) {
    add(entries, `skills-${slug(skill.name)}`, `skills.${slug(skill.name)}`, `Skills: ${skill.name}`, skill.keywords?.join(", "));
  }

  for (const [index, job] of (resume.work ?? []).entries()) {
    const section = `${job.position}, ${job.name}`;
    const jobSlug = slug(job.name ?? `role-${index}`);
    add(entries, `work-${jobSlug}-summary`, `work.${index}.summary`, section, job.summary);

    for (const [highlightIndex, highlight] of (job.highlights ?? []).entries()) {
      add(
        entries,
        `work-${jobSlug}-${slug(firstWords(highlight, 7))}`,
        `work.${index}.highlights.${highlightIndex}`,
        section,
        highlight,
      );
    }
  }

  for (const [index, reference] of (resume.references ?? []).entries()) {
    const author = [reference.name, reference.title, reference.company].filter(Boolean).join(", ");
    add(
      entries,
      `reference-${slug(reference.name ?? index)}`,
      `references.${index}`,
      `Endorsement: ${reference.name ?? index}`,
      [author, reference.reference].filter(Boolean).join(": "),
      [
        "endorsement",
        "endorsements",
        "recommendation",
        "recommendations",
        "reference",
        "references",
        "what are people saying about mundi",
        "what do people say about mundi",
        "what do people think about mundi",
        "people say about mundi",
        "people saying about mundi",
        "people think about mundi",
      ],
      reference.url,
    );
  }

  for (const keyword of resume.meta?.keywords ?? []) {
    add(entries, `keyword-${slug(keyword)}`, "meta.keywords", "Keywords", keyword);
  }

  return ensureUniqueIds(entries);
}

export function profileLinks(resume) {
  return (resume.basics?.profiles ?? [])
    .map((profile) => {
      const url = profile.url ? String(profile.url).replace(/\/$/, "") : "";
      const label = [profile.network, profile.username].filter(Boolean).join(": ");
      return [label, url].filter(Boolean).join(" - ");
    })
    .filter(Boolean);
}

function add(entries, id, path, section, text, aliases = [], url = "https://mun.digital/resume.md") {
  if (!text) {
    return;
  }

  entries.push({
    id,
    path,
    section,
    text,
    url,
    searchText: [text, ...aliases].join(" "),
  });
}

function searchEvidence(resume, normalizedQuery, limit) {
  const evidence = collectEvidence(resume);
  const searchableEvidence = isEndorsementQuery(normalizedQuery)
    ? evidence.filter((entry) => entry.path.startsWith("references."))
    : evidence;

  return searchableEvidence
    .map((entry) => ({
      ...entry,
      score: scoreEntry(entry.searchText ?? entry.text, normalizedQuery),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

function scoreEntry(text, query) {
  const haystack = text.toLowerCase();
  if (haystack.includes(query)) {
    return 100 + query.length;
  }

  const terms = query.split(/\s+/).filter(Boolean);
  return terms.reduce((score, term) => (haystack.includes(term) ? score + 10 : score), 0);
}

function isEndorsementQuery(query) {
  return [
    "endorsement",
    "endorsements",
    "recommendation",
    "recommendations",
    "reference",
    "references",
    "people say",
    "people saying",
    "people think",
  ].some((term) => query.includes(term));
}

function slug(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function firstWords(value, count) {
  return String(value ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, count)
    .join(" ");
}

function ensureUniqueIds(entries) {
  const seen = new Map();

  return entries.map((entry) => {
    const count = seen.get(entry.id) ?? 0;
    seen.set(entry.id, count + 1);

    if (count === 0) {
      return entry;
    }

    return {
      ...entry,
      id: `${entry.id}-${count + 1}`,
    };
  });
}
