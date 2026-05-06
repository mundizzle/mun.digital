import type { ResumeViewModel } from "./types";

interface JsonResume {
  basics?: {
    name?: string;
    label?: string;
    summary?: string;
    location?: {
      city?: string;
      region?: string;
      countryCode?: string;
    };
    profiles?: Array<{
      network?: string;
      username?: string;
      url?: string;
    }>;
  };
  skills?: Array<{
    name?: string;
    keywords?: string[];
  }>;
  work?: Array<{
    name?: string;
    position?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }>;
  education?: Array<{
    institution?: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
  }>;
  references?: Array<{
    name?: string;
    reference?: string;
    title?: string;
    company?: string;
    url?: string;
  }>;
}

const selectedWorkPatterns = /^(Wilson QBX|Peak Performance Project|Iron Mountain|Experian BusinessIQ|United Airlines)/i;
const selectedClients = [
  "JP Morgan Chase",
  "Morgan Stanley",
  "Bank of America",
  "Citigroup",
  "Walmart",
  "Goldman Sachs",
  "Broadridge",
  "Redbox",
  "CheetahMail",
  "M&T Bank",
  "Wilmington Bank",
];

export function adaptResume(resume: JsonResume): ResumeViewModel {
  const location = [resume.basics?.location?.city, resume.basics?.location?.region]
    .filter(Boolean)
    .join(", ");

  return {
    name: resume.basics?.name ?? "Mundi Morgado",
    location,
    summaryTitle: "Summary",
    skillsTitle: "Skills",
    experienceTitle: "Experience",
    educationTitle: "Education",
    endorsementsTitle: "Endorsements",
    contactLinks: buildContactLinks(resume),
    summary: resume.basics?.summary ? [resume.basics.summary] : [],
    skills: (resume.skills ?? []).map((skill) => ({
      label: skill.name ?? "Skills",
      tokens: skill.keywords ?? [],
    })),
    jobs: (resume.work ?? []).map((job) => {
      const highlights = job.highlights ?? [];
      const selectedWork = highlights.filter((highlight) => selectedWorkPatterns.test(highlight));
      const bullets = highlights.filter((highlight) => !selectedWorkPatterns.test(highlight));

      return {
        title: job.position ?? "Role",
        company: job.name ?? "Company",
        companyUrl: job.url,
        dates: formatDateRange(job.startDate, job.endDate),
        tenure: null,
        context: job.summary ?? "",
        bullets,
        selectedWork,
        selectedClients: job.name === "TandemSeven" ? selectedClients : [],
      };
    }),
    education: (resume.education ?? []).map((entry) => ({
      school: entry.institution ?? "School",
      degree: [entry.studyType, entry.area].filter(Boolean).join(", "),
      dates: formatDateRange(entry.startDate, entry.endDate),
    })),
    endorsements: (resume.references ?? []).map((reference) => ({
      author: reference.name ?? "Reference",
      authorTitle: reference.title,
      company: reference.company,
      sourceUrl: reference.url,
      quoteParagraphs: reference.reference ? [reference.reference] : [],
    })),
  };
}

function buildContactLinks(resume: JsonResume) {
  const profileLinks = (resume.basics?.profiles ?? [])
    .filter((profile) => profile.url)
    .map((profile) => ({
      text: profile.network === "Website" ? "mun.digital" : formatProfileText(profile.url, profile.username),
      href: profile.url ?? "",
    }));

  return [
    ...profileLinks,
    { text: "JSON", href: "/resume.json" },
    { text: "MD", href: "/resume.md" },
    { text: "PDF", href: "/resume.pdf" },
  ];
}

function formatProfileText(url?: string, username?: string) {
  if (!url) {
    return username ?? "";
  }

  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function formatDateRange(start?: string, end?: string) {
  if (!start && !end) {
    return "";
  }

  return [formatDate(start), formatDate(end)].filter(Boolean).join(" - ");
}

function formatDate(value?: string) {
  if (!value) {
    return "Present";
  }

  const [year, month] = value.split("-");
  if (!month) {
    return year;
  }

  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
