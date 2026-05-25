import Link from "next/link";
import { SectionHeader } from "@/components/resume/SectionHeader";
import type { Post, PostBlock } from "@/content/portfolio";

export function WritingIndex({ posts }: { posts: readonly Post[] }) {
  return (
    <main>
      <section className="section section--first">
        <SectionHeader index="00" title="Writing" />
        <div className="grid">
          {posts.map((post) => (
            <article key={post.id} className="grid gap-4 border-t border-border py-6 last:border-b sm:grid-cols-[120px_1fr]">
              <div className="text-[11px] tracking-[0.18em] text-subtle-foreground uppercase">
                <div>{post.date}</div>
                <div className="mt-2 text-primary">{post.readTime}</div>
              </div>
              <div>
                <h2 className="m-0 text-[24px] leading-tight tracking-normal">
                  <Link href={`/writing/${post.id}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 font-sans text-[15px] leading-[1.7] text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-border px-2 py-1 text-[10px] tracking-[0.16em] text-subtle-foreground uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function renderBlock(block: PostBlock, index: number) {
  if (block.type === "p") return <p key={index}>{block.text}</p>;
  if (block.type === "h3") return <h3 key={index}>{block.text}</h3>;
  if (block.type === "blockquote") return <blockquote key={index}>{block.text}</blockquote>;
  if (block.type === "pre") return <pre key={index}>{block.text}</pre>;
  if (block.type === "ul") {
    return (
      <ul key={index}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return null;
}

export function WritingPost({ post }: { post: Post }) {
  const body = post.body ?? [
    {
      type: "p" as const,
      text: "Full post coming soon. This placeholder keeps the final article layout visible during the UI port.",
    },
  ];

  return (
    <main>
      <section className="section section--first">
        <Link
          href="/writing"
          className="mb-5 inline-block text-[11px] tracking-[0.18em] text-primary uppercase hover:text-foreground"
        >
          ← Back to writing
        </Link>
        <div className="grid gap-6 md:grid-cols-[var(--rail-width)_1fr]">
          <aside className="text-[11px] tracking-[0.18em] text-subtle-foreground uppercase">
            <div>{post.date}</div>
            <div className="mt-2 text-primary">{post.readTime}</div>
            <div className="mt-5 grid gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="border border-border px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </aside>
          <article>
            <h1 className="m-0 text-[clamp(2.35rem,1.75rem+2.4vw,4.5rem)] leading-[0.96] font-semibold tracking-normal">
              {post.title}
            </h1>
            <div className="prose prose-invert mt-8 max-w-none font-sans text-muted-foreground">
              {body.map(renderBlock)}
              <h3>END OF POST</h3>
              <p>
                Tools mentioned: <code>@mun.digital/cli</code>, <code>/api/mcp</code>,
                and curl with <code>Accept: text/markdown</code>.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
