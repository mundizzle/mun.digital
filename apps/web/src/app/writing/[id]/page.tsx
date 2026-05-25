import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/chrome/PageFrame";
import { WritingPost } from "@/components/writing/WritingViews";
import { getWritingPost, getWritingPosts } from "@/lib/writing";

type Props = PageProps<"/writing/[id]">;

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const posts = await getWritingPosts();
  return posts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getWritingPost(id);

  if (!post) {
    return {
      title: "Writing | mun.digital",
    };
  }

  return {
    title: `${post.title} | mun.digital`,
    description: post.description,
    alternates: {
      canonical: `https://mun.digital/writing/${post.id}`,
    },
  };
}

export default async function WritingPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getWritingPost(id);

  if (!post) {
    notFound();
  }

  return (
    <PageFrame>
      <WritingPost post={post} />
    </PageFrame>
  );
}
