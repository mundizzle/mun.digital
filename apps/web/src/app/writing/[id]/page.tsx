import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/chrome/PageFrame";
import { WritingPost } from "@/components/writing/WritingViews";
import { getPost, posts } from "@/content/portfolio";

type Props = PageProps<"/writing/[id]">;

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = getPost(id);

  if (!post) {
    return {
      title: "Writing | mun.digital",
    };
  }

  return {
    title: `${post.title} | mun.digital`,
    description: post.excerpt,
    alternates: {
      canonical: `https://mun.digital/writing/${post.id}`,
    },
  };
}

export default async function WritingPostPage({ params }: Props) {
  const { id } = await params;
  const post = getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <PageFrame>
      <WritingPost post={post} />
    </PageFrame>
  );
}
