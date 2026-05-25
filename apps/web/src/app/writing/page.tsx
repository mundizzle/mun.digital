import type { Metadata } from "next";
import { PageFrame } from "@/components/chrome/PageFrame";
import { WritingIndex } from "@/components/writing/WritingViews";
import { posts } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Writing | mun.digital",
  description: "Writing previews and article layouts from the mun.digital UI port.",
  alternates: {
    canonical: "https://mun.digital/writing",
  },
};

export default function WritingPage() {
  return (
    <PageFrame>
      <WritingIndex posts={posts} />
    </PageFrame>
  );
}
