import Link from "next/link";
import { SectionHeader } from "@/components/resume/SectionHeader";
import type { WritingPost as WritingPostModel } from "@/lib/writing";

export function WritingIndex({ posts }: { posts: readonly WritingPostModel[] }) {
  return (
    <main>
      <section className="section section--first">
        <SectionHeader index="00" title="Writing" />
        <div className="grid">
          {posts.map((post) => (
            <article key={post.id} className="grid gap-4 border-t border-border py-6 last:border-b sm:grid-cols-[120px_1fr]">
              <div className="text-[11px] tracking-[0.18em] text-subtle-foreground uppercase">
                <time dateTime={post.date}>{post.displayDate}</time>
              </div>
              <div>
                <h2 className="m-0 text-[24px] leading-tight tracking-normal">
                  <Link href={`/writing/${post.id}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h2>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export function WritingPost({ post }: { post: WritingPostModel }) {
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
            <time dateTime={post.date}>{post.displayDate}</time>
          </aside>
          <article>
            <h1 className="m-0 text-[clamp(2.35rem,1.75rem+2.4vw,4.5rem)] leading-[0.96] font-semibold tracking-normal">
              {post.title}
            </h1>
            <div
              className="prose prose-invert mt-8 max-w-none font-sans text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </article>
        </div>
      </section>
    </main>
  );
}
