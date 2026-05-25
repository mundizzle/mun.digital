import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/chrome/PageFrame";
import { CaseStudy } from "@/components/work/WorkViews";
import { getWork, work } from "@/content/portfolio";

type Props = PageProps<"/work/[id]">;

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = getWork(id);

  if (!item) {
    return {
      title: "Work | mun.digital",
    };
  }

  return {
    title: `${item.title} | mun.digital`,
    description: item.summary,
    alternates: {
      canonical: `https://mun.digital/work/${item.id}`,
    },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;
  const item = getWork(id);

  if (!item) {
    notFound();
  }

  return (
    <PageFrame>
      <CaseStudy item={item} />
    </PageFrame>
  );
}
