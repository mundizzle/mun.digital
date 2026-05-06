import publicResume from "../../public/resume.json" with { type: "json" };

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
  const evidence = collectEvidence(resume);
  const matches = evidence
    .map((entry) => ({
      ...entry,
      score: scoreEntry(entry.text, normalizedQuery),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .slice(0, limit)
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

  add(entries, "basics.summary", "Summary", resume.basics?.summary);

  for (const [index, profile] of (resume.basics?.profiles ?? []).entries()) {
    add(
      entries,
      `basics.profiles.${index}`,
      `Profile: ${profile.network ?? profile.username ?? index}`,
      [profile.network, profile.username, profile.url].filter(Boolean).join(" - "),
    );
  }

  for (const skill of resume.skills ?? []) {
    add(entries, `skills.${slug(skill.name)}`, `Skills: ${skill.name}`, skill.keywords?.join(", "));
  }

  for (const [index, job] of (resume.work ?? []).entries()) {
    const section = `${job.position}, ${job.name}`;
    add(entries, `work.${index}.summary`, section, job.summary);

    for (const [highlightIndex, highlight] of (job.highlights ?? []).entries()) {
      add(entries, `work.${index}.highlights.${highlightIndex}`, section, highlight);
    }
  }

  for (const keyword of resume.meta?.keywords ?? []) {
    add(entries, "meta.keywords", "Keywords", keyword);
  }

  return entries;
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

function add(entries, path, section, text) {
  if (!text) {
    return;
  }

  entries.push({
    path,
    section,
    text,
  });
}

function scoreEntry(text, query) {
  const haystack = text.toLowerCase();
  if (haystack.includes(query)) {
    return 100 + query.length;
  }

  const terms = query.split(/\s+/).filter(Boolean);
  return terms.reduce((score, term) => (haystack.includes(term) ? score + 10 : score), 0);
}

function slug(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
