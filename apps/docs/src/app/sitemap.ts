import type { MetadataRoute } from "next";
import { docPages } from "@/lib/docs";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://docs.mun.digital",
    },
    ...docPages.map((page) => ({
      url: `https://docs.mun.digital/${page.slug}`,
    })),
  ];
}
