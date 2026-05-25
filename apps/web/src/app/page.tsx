import type { Metadata } from "next";
import { PageFrame } from "@/components/chrome/PageFrame";
import { HeroCard } from "@/components/landing/HeroCard";
import {
  AgentsBlock,
  ReadingRail,
  WorkPreview,
  WritingTeaser,
} from "@/components/landing/LandingSections";

export const metadata: Metadata = {
  title: "Mundi Morgado | mun.digital",
  description:
    "Portfolio, writing, work, and agent-readable surfaces for UX engineer Mundi Morgado.",
  alternates: {
    canonical: "https://mun.digital",
  },
};

export default function Home() {
  return (
    <PageFrame wide className="overflow-x-visible pt-0 pb-8 md:pt-0 md:pb-12">
      <main>
        <HeroCard />

        <div className="grid gap-10 min-[900px]:grid-cols-[minmax(0,1fr)_320px] min-[1100px]:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <WritingTeaser />
            <WorkPreview />
          </div>
          <aside className="relative min-[900px]:self-stretch min-[900px]:overflow-hidden">
            <div className="min-[900px]:absolute min-[900px]:inset-0 min-[900px]:flex min-[900px]:min-h-0 min-[900px]:flex-col">
              <ReadingRail />
              <AgentsBlock />
            </div>
          </aside>
        </div>
      </main>
    </PageFrame>
  );
}
