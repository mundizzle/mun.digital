import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mun.digital",
      lastModified: new Date("2026-05-06"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://mun.digital/resume.json",
      lastModified: new Date("2026-05-06"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://mun.digital/raindrops.json",
      lastModified: new Date("2026-05-06"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://mun.digital/llms.txt",
      lastModified: new Date("2026-05-06"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://mun.digital/resume.md",
      lastModified: new Date("2026-05-06"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://mun.digital/mundi-morgado-resume.pdf",
      lastModified: new Date("2026-05-06"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
