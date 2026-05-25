import type { Metadata } from "next";
import { PageFrame } from "@/components/chrome/PageFrame";
import { WritingIndex } from "@/components/writing/WritingViews";
import { getWritingPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing | mun.digital",
  description: "Writing by Mundi Morgado.",
  alternates: {
    canonical: "https://mun.digital/writing",
  },
};

export const dynamic = "force-static";

export default async function WritingPage() {
  const posts = await getWritingPosts();

  return (
    <PageFrame>
      <WritingIndex posts={posts} />
    </PageFrame>
  );
}
