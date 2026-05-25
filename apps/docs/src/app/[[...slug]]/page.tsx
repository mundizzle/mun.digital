import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { docPages, getPage, readPageMarkdown, renderMarkdown, TokenReference } from "@/lib/docs";

const docsOrigin = "https://docs.mun.digital";

export function generateStaticParams() {
  return [{ slug: undefined }, ...docPages.map((page) => ({ slug: [page.slug] }))];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const currentSlug = slug?.[0];

  if (!currentSlug) {
    return {
      title: "mun.digital Public Reference",
      description: "Public reference documentation for mun.digital UI, tokens, CLI, MCP, Storybook, and agent workflows.",
      alternates: {
        canonical: docsOrigin,
      },
    };
  }

  const page = getPage(currentSlug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | mun.digital Public Reference`,
    description: page.description,
    alternates: {
      canonical: `${docsOrigin}/${page.slug}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const currentSlug = slug?.[0];

  if (!currentSlug) {
    return <DocsShell />;
  }

  const page = getPage(currentSlug);

  if (!page || (slug && slug.length > 1)) {
    notFound();
  }

  const markdown = readPageMarkdown(page);

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-5 py-8 md:grid-cols-[240px_minmax(0,1fr)] md:px-8">
      <DocsNav activeSlug={page.slug} />
      <article className="min-w-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h1 className="m-0 font-mono text-3xl leading-tight font-bold tracking-[-0.01em]">{page.title}</h1>
            <p className="mt-2 mb-0 max-w-[68ch] text-sm text-muted-foreground">{page.description}</p>
          </div>
          <a
            className="inline-flex border border-primary px-3 py-2 font-mono text-xs tracking-[0.12em] text-primary uppercase no-underline hover:bg-primary hover:text-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
            href={`/${page.slug}.md`}
          >
            View Markdown
          </a>
        </div>
        <div>{renderMarkdown(markdown)}</div>
        {page.slug === "tokens" ? <TokenReference /> : null}
      </article>
    </main>
  );
}

function DocsShell() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-5 py-8 md:grid-cols-[240px_minmax(0,1fr)] md:px-8">
      <DocsNav />
      <article className="min-w-0">
        <div className="border-b border-border pb-5">
          <h1 className="m-0 font-mono text-3xl leading-tight font-bold tracking-[-0.01em]">
            mun.digital Public Reference
          </h1>
          <p className="mt-3 mb-0 max-w-[72ch] text-[15px] leading-7 text-muted-foreground">
            Public documentation for reusable UI, tokens, CLI, MCP, Storybook, and agent workflow.
          </p>
        </div>
        <ul className="mt-6 grid list-none gap-4 p-0">
          {docPages.map((page) => (
            <li className="border-l-2 border-primary bg-card px-4 py-3" key={page.slug}>
              <Link className="font-mono text-base font-semibold text-foreground no-underline hover:text-primary" href={`/${page.slug}`}>
                {page.title}
              </Link>
              <p className="mt-2 mb-0 text-sm leading-6 text-muted-foreground">{page.description}</p>
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}

function DocsNav({ activeSlug }: { activeSlug?: string }) {
  return (
    <aside className="border-b border-border pb-5 md:border-r md:border-b-0 md:pr-6">
      <Link className="block text-[13px] font-semibold tracking-[0.18em] text-primary uppercase no-underline" href="/">
        mun.digital docs
      </Link>
      <nav className="mt-6" aria-label="Public reference pages">
        <ul className="m-0 grid list-none gap-2 p-0">
          {docPages.map((item) => (
            <li key={item.slug}>
              <Link
                className={`block border-l-2 py-1.5 pl-3 text-sm no-underline ${
                  item.slug === activeSlug
                    ? "border-primary text-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
                href={`/${item.slug}`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
