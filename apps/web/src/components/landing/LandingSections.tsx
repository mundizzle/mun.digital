import Link from "next/link";
import { SectionMarker } from "@/components/chrome/SectionMarker";
import { surfaces, work } from "@/content/portfolio";
import { readingLinks } from "@/content/reading";
import { getWritingPosts } from "@/lib/writing";
import { WorkTiles } from "./WorkTiles";

export async function WritingTeaser() {
  const [post] = await getWritingPosts();

  if (!post) {
    return null;
  }

  return (
    <section className="mb-10" aria-labelledby="latest-writing">
      <SectionMarker code="WRITING" />
      <article className="grid gap-4 py-5 sm:grid-cols-[110px_1fr]">
        <div className="text-[11px] tracking-[0.18em] text-subtle-foreground uppercase">
          <time dateTime={post.date}>{post.displayDate}</time>
        </div>
        <div>
          <h2 id="latest-writing" className="m-0 text-[18px] leading-tight font-semibold tracking-normal text-foreground">
            <Link className="hover:text-primary" href={`/writing/${post.id}`}>
              {post.title}
            </Link>
          </h2>
          <p className="mt-3 font-sans text-[15px] leading-[1.7] text-muted-foreground">
            {post.description}
          </p>
          <Link
            href={`/writing/${post.id}`}
            className="mt-4 inline-block text-[11px] tracking-[0.2em] text-primary uppercase hover:text-foreground"
          >
            Read full →
          </Link>
        </div>
      </article>
    </section>
  );
}

export function WorkPreview() {
  return (
    <section aria-labelledby="work-preview">
      <SectionMarker code="WORK" />
      <h2 id="work-preview" className="sr-only">
        Selected work
      </h2>
      <WorkTiles items={work} />
    </section>
  );
}

export function ReadingRail() {
  if (readingLinks.length === 0) {
    return null;
  }

  const looped = [...readingLinks, ...readingLinks];

  return (
    <section className="mb-8 min-[900px]:flex min-[900px]:min-h-0 min-[900px]:flex-1 min-[900px]:flex-col" aria-label="Reading">
      <SectionMarker code="READING" className="min-[900px]:mt-0" />
      <div className="reading-mask max-h-none overflow-hidden min-[900px]:min-h-0 min-[900px]:flex-1">
        <div className="reading-track grid gap-4 min-[900px]:animate-[scroll-up_86s_linear_infinite] min-[900px]:hover:[animation-play-state:paused]">
          {looped.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-border/60 bg-card p-4 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <div className="text-[10px] tracking-[0.18em] text-primary uppercase">
                {item.tags[0]}
              </div>
              <h3 className="mt-3 text-[14px] leading-snug font-semibold">{item.title}</h3>
              {item.note ? (
                <p className="mt-2 font-sans text-[13px] leading-[1.55] text-muted-foreground">
                  {item.note}
                </p>
              ) : null}
              <div className="mt-3 text-[10px] tracking-[0.16em] text-subtle-foreground uppercase">
                {item.domain}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AgentsBlock() {
  return (
    <section className="min-[900px]:mt-auto" aria-label="Agents">
      <SectionMarker code="AGENTS" />
      <ul className="m-0 list-none border border-border/60 p-4 font-sans text-[13px] leading-[1.6]">
        {surfaces.map((surface) => (
          <li
            key={surface.kind}
            className="relative mb-3 pl-[22px] last:mb-0 before:absolute before:top-[0.78em] before:left-0 before:size-[5px] before:-translate-y-1/2 before:bg-primary before:content-['']"
          >
            <a
              href={surface.href}
              className="text-primary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {surface.target}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
