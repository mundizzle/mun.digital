// Temporary UI-port fixture content for the Claude Design portfolio surface.
// This is not profile source data and is not generated public-artifact data.

export const heroRoles = [
  "PUSHING PIXELS...",
  "TAMING TOKENS...",
  "HERDING AGENTS...",
  "VIBING HUMANS...",
  "BEST FRONT-END DEVELOPER EVER...",
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
    target: "https://mun.digital/api/mcp",
    href: "https://docs.mun.digital/mcp",
  },
  {
    kind: "CLI",
    target: "npx -y @mun.digital/cli",
    href: "https://www.npmjs.com/package/@mun.digital/cli",
  },
  {
    kind: "REPO",
    target: "github.com/mundizzle/mun.digital",
    href: "https://github.com/mundizzle/mun.digital",
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

export function getWork(id: string) {
  return work.find((item) => item.id === id);
}
