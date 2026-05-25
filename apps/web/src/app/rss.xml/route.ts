import { buildWritingRss } from "@/lib/rss";
import { getWritingPosts } from "@/lib/writing";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getWritingPosts();
  const rss = buildWritingRss(posts);

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
