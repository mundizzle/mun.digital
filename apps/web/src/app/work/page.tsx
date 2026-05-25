import type { Metadata } from "next";
import { PageFrame } from "@/components/chrome/PageFrame";
import { WorkIndex } from "@/components/work/WorkViews";
import { work } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Work | mun.digital",
  description: "Selected portfolio work and case-study previews for Mundi Morgado.",
  alternates: {
    canonical: "https://mun.digital/work",
  },
};

export default function WorkPage() {
  return (
    <PageFrame>
      <WorkIndex items={work} />
    </PageFrame>
  );
}
