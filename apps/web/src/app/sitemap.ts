import type { MetadataRoute } from "next";
import { posts, work } from "@/content/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-05-25");

  return [
    {
      url: "https://mun.digital",
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://mun.digital/resume",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://mun.digital/work",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...work.map((item) => ({
      url: `https://mun.digital/work/${item.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: "https://mun.digital/writing",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `https://mun.digital/writing/${post.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: "https://mun.digital/resume.json",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://mun.digital/raindrops.json",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://mun.digital/llms.txt",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://mun.digital/resume.md",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://mun.digital/mundi-morgado-resume.pdf",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
