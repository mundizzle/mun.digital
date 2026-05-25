import type { Metadata } from "next";
import { PageFrame } from "@/components/chrome/PageFrame";
import { HeroCard } from "@/components/landing/HeroCard";
import {
  AgentsBlock,
  EndorsementPull,
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
    <PageFrame wide>
      <main>
        <HeroCard />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <WritingTeaser />
            <WorkPreview />
            <EndorsementPull />
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <ReadingRail />
            <AgentsBlock />
          </aside>
        </div>
      </main>
    </PageFrame>
  );
}
