// Temporary UI-port fixture content for the Claude Design portfolio surface.
// This is not profile source data and is not generated public-artifact data.

export const heroRoles = [
  "UX ENGINEER",
  "FRONT-END ARCHITECT",
  "DESIGN SYSTEMS LEAD",
  "TECHNICAL LEADER",
  "DESIGN-TOKEN ENGINEER",
  "AGENTIC DEVELOPMENT PRACTITIONER",
  "HIRING MANAGER & MENTOR",
] as const;

export const hero = {
  title: "Mundi Morgado",
  tagline:
    "25+ years shipping products, platforms, and design systems. Now building for the AI era, where agents are users too.",
  location: "Oakland, CA",
};

export const surfaces = [
  {
    kind: "MCP",
    label: "MCP endpoint",
    target: "mun.digital/api/mcp",
    href: "https://mun.digital/api/mcp",
    note: "Hosted, public, no auth. Tools: search, brief, links_search, fetch.",
  },
  {
    kind: "CLI",
    label: "Command-line",
    target: "npx -y @mun.digital/cli",
    href: "https://www.npmjs.com/package/@mun.digital/cli",
    note: "profile, search, brief, links. Agent and human readable.",
  },
  {
    kind: "DOCS",
    label: "Design system",
    target: "docs.mun.digital",
    href: "https://docs.mun.digital",
    note: "MCP, CLI, architecture, tokens, and agentic workflow.",
  },
  {
    kind: "UI",
    label: "Storybook",
    target: "storybook.mun.digital",
    href: "https://storybook.mun.digital",
    note: "Live workbench for app-owned portfolio components and tokens.",
  },
  {
    kind: "REPO",
    label: "Source",
    target: "github.com/mundizzle/mun.digital",
    href: "https://github.com/mundizzle/mun.digital",
    note: "pnpm monorepo: web, docs, storybook, tokens, cli.",
  },
] as const;

export const work = [
  {
    id: "wilson-qbx",
    year: "2024",
    title: "Wilson QBX",
    client: "Wilson / Rightpoint",
    role: "Technical lead - React, Next.js, Tailwind, ECharts",
    tag: "PRODUCT LAUNCH",
    summary:
      "Front-end technical lead for the launch of Wilson's Bluetooth-connected football. Platform now used by the NFL, Division I college, and elite high-school programs.",
    facts: [
      ["Year", "2024"],
      ["Client", "Wilson, via Rightpoint"],
      ["Role", "Technical Lead"],
      ["Team", "3 front-end engineers"],
      ["Stack", "React / Next.js / Tailwind / ECharts"],
      ["Outcome", "Adopted by NFL, D-I college, elite HS programs"],
    ],
  },
  {
    id: "p3",
    year: "2023",
    title: "P3 - Athlete biomechanics platform",
    client: "Peak Performance Project / Rightpoint",
    role: "Front-end architect - data visualization",
    tag: "DATA VISUALIZATION",
    summary:
      "Architected the front end of a data-visualization platform serving hundreds of professional athletes; used in the NBA Pro Basketball Combine.",
    facts: [
      ["Year", "2023"],
      ["Client", "P3, via Rightpoint"],
      ["Role", "Front-End Architect"],
      ["Stack", "React / Next.js / ECharts"],
      ["Scale", "Hundreds of pro athletes / NBA Combine deployment"],
    ],
  },
  {
    id: "gierd-ds",
    year: "2025",
    title: "Gierd Design System",
    client: "Gierd",
    role: "Co-creator - Rails view helpers, 20+ components",
    tag: "DESIGN SYSTEM",
    summary:
      "Co-created Gierd's canonical design system: 20+ reusable components implemented as Rails view helpers, with a Figma variable export pipeline for Tailwind theming.",
    facts: [
      ["Year", "2025"],
      ["Company", "Gierd (Series A, $8M)"],
      ["Role", "Principal Front-End Engineer / Co-creator"],
      ["Surface", "20+ Rails view-helper components"],
      ["Pipeline", "Figma variables to Tailwind tokens"],
    ],
  },
  {
    id: "iron-mountain",
    year: "2022",
    title: "Iron Mountain - Storybook design system",
    client: "Iron Mountain / Rightpoint",
    role: "Lead - 50-component library, Sitecore + React",
    tag: "DESIGN SYSTEM",
    summary:
      "Built a 50-component Storybook design system. Pioneered a headless CMS architecture pairing Sitecore with React; mentored two junior engineers into senior contributors.",
    facts: [
      ["Year", "2022"],
      ["Client", "Iron Mountain"],
      ["Role", "Front-End Lead"],
      ["Surface", "50-component Storybook library"],
      ["Stack", "React / Storybook / Sitecore headless"],
    ],
  },
  {
    id: "united",
    year: "2018",
    title: "United Airlines mobile web",
    client: "United Airlines / TandemSeven",
    role: "Tech lead - jQuery to React migration",
    tag: "PLATFORM MIGRATION",
    summary:
      "Won the engagement and led a team of 10 developers on the full mobile-web migration from jQuery and jQueryUI to React.",
    facts: [
      ["Year", "2018"],
      ["Client", "United Airlines"],
      ["Role", "Front-End Tech Lead"],
      ["Team", "10 engineers"],
      ["Stack", "jQuery to React migration"],
    ],
  },
] as const;

export type WorkItem = (typeof work)[number];

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "pre"; text: string };

export const posts: Array<{
  id: string;
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  body?: PostBlock[];
}> = [
  {
    id: "agents-are-users-too",
    date: "May 2026",
    title: "Agents are users too",
    excerpt:
      "Why the next generation of product surfaces have to serve LLMs the same way they serve humans, and what changes when an MCP endpoint is your second front door.",
    tags: ["AGENTIC", "PRODUCT", "MCP"],
    readTime: "8 MIN",
    body: [
      {
        type: "p",
        text: "If you build a product website in 2026, you have two audiences. One of them types with their thumbs. The other one types with a Python loop.",
      },
      {
        type: "p",
        text: "I rebuilt mun.digital specifically to be readable by both. The same sanitized resume data powers visible HTML, generated PDF, Markdown, npm CLI, and a public MCP endpoint.",
      },
      { type: "h3", text: "What changes" },
      {
        type: "p",
        text: "When you accept that an agent is a user, three things stop making sense:",
      },
      {
        type: "ul",
        items: [
          "Marketing copy. An agent will not be persuaded by world-class solutions. It will be persuaded by structured facts.",
          "Decorative imagery. An OG image is for a Slack unfurl. The real OG is the markdown.",
          "Trapped data. Your contact form, scroll-jacked timeline, and interactive resume are invisible to the loop.",
        ],
      },
      { type: "h3", text: "What survives" },
      {
        type: "p",
        text: "Typography. Structure. Hierarchy. Tone. If a page reads like a manual, an agent can summarize it. If it reads like a marketing landing, it cannot.",
      },
      {
        type: "blockquote",
        text: "Build the website so that an LLM running curl with text/markdown gets the same value as a human with a retina display.",
      },
    ],
  },
  {
    id: "tokens-from-figma",
    date: "Mar 2026",
    title: "From Figma variables to Tailwind theme, in one pnpm script",
    excerpt:
      "Notes on the export pipeline I built at Gierd: how to keep designers in Figma and engineers in tokens.json without anyone copy-pasting hex codes at 11pm.",
    tags: ["DESIGN SYSTEMS", "TOKENS", "FIGMA"],
    readTime: "12 MIN",
  },
  {
    id: "rails-views-design-system",
    date: "Feb 2026",
    title: "A 20-component design system in Rails view helpers",
    excerpt:
      "You can ship a design system in Rails. You can even like it. The trick is to stop reaching for React and start trusting your ERB.",
    tags: ["RAILS", "DESIGN SYSTEMS"],
    readTime: "9 MIN",
  },
  {
    id: "rfp-front-end",
    date: "Nov 2025",
    title: "Scoping front-end work for a $1M RFP",
    excerpt:
      "What I learned writing front-end scopes for 100+ enterprise engagements over 16 years at TandemSeven, and the mistake I still make.",
    tags: ["LEADERSHIP", "CONSULTING"],
    readTime: "11 MIN",
  },
  {
    id: "agentic-prs",
    date: "Sep 2025",
    title: "What an agentic PR review actually looks like",
    excerpt:
      "Not AI suggested some changes. A repeatable, codified standard that improved UI PR quality across a 20-engineer team.",
    tags: ["AGENTIC", "LEADERSHIP"],
    readTime: "7 MIN",
  },
];

export type Post = (typeof posts)[number];

export function getWork(id: string) {
  return work.find((item) => item.id === id);
}

export function getPost(id: string) {
  return posts.find((item) => item.id === id);
}
