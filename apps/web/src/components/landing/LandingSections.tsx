import Link from "next/link";
import { SectionMarker } from "@/components/chrome/SectionMarker";
import { posts, surfaces, work } from "@/content/portfolio";
import { readingLinks } from "@/content/reading";
import { WorkTiles } from "./WorkTiles";

export function WritingTeaser() {
  const post = posts[0];

  return (
    <section className="mb-10" aria-labelledby="latest-writing">
      <SectionMarker code="WRITING" />
      <article className="grid gap-4 border-y border-border py-5 sm:grid-cols-[110px_1fr]">
        <div className="text-[11px] tracking-[0.18em] text-subtle-foreground uppercase">
          <div>{post.date.replace(" ", ".")}</div>
          <div className="mt-2 text-primary">{post.readTime}</div>
        </div>
        <div>
          <h2 id="latest-writing" className="m-0 text-[24px] leading-tight tracking-normal">
            <Link className="hover:text-primary" href={`/writing/${post.id}`}>
              {post.title}
            </Link>
          </h2>
          <p className="mt-3 font-sans text-[15px] leading-[1.7] text-muted-foreground">
            {post.excerpt}
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
    <section className="mb-10" aria-labelledby="work-preview">
      <SectionMarker code="WORK" />
      <h2 id="work-preview" className="sr-only">
        Selected work
      </h2>
      <WorkTiles items={work} />
      <Link
        href="/work"
        className="mt-5 inline-block text-[11px] tracking-[0.2em] text-primary uppercase hover:text-foreground"
      >
        All work →
      </Link>
    </section>
  );
}

export function EndorsementPull() {
  return (
    <figure className="relative m-0 border-l-2 border-primary py-2 pl-7">
      <div className="absolute -left-1 top-0 text-[52px] leading-none text-primary">”</div>
      <blockquote className="m-0 font-sans text-[16px] leading-[1.8] text-foreground italic">
        Mundi is extremely talented, forward-thinking, and consistently pairs technology
        decisions with real business needs. As a leader, he is humble, hard-working, and
        leads by action. As a mentor, he is patient, wise, and a great communicator.
      </blockquote>
      <figcaption className="mt-5 text-[10px] tracking-[0.18em] text-subtle-foreground uppercase">
        <span className="text-primary">—</span> Nathan Logan <span className="mx-2">{"//"}</span>
        Engineering Manager, Bluebeam Inc.
      </figcaption>
    </figure>
  );
}

export function ReadingRail() {
  if (readingLinks.length === 0) {
    return null;
  }

  const looped = [...readingLinks, ...readingLinks];

  return (
    <section className="mb-8" aria-label="Reading">
      <SectionMarker code="READING" className="min-[900px]:mt-0" />
      <div className="reading-mask max-h-none overflow-hidden min-[900px]:max-h-[380px]">
        <div className="reading-track grid gap-4 min-[900px]:animate-[scroll-up_86s_linear_infinite] min-[900px]:hover:[animation-play-state:paused]">
          {looped.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={item.href}
              className="block border border-border bg-card p-4 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <div className="text-[10px] tracking-[0.18em] text-primary uppercase">
                {item.tags[0]}
                {item.tags[1] ? (
                  <span className="text-subtle-foreground">/{item.tags[1]}</span>
                ) : null}
              </div>
              <h3 className="mt-3 text-[14px] leading-snug font-semibold">{item.title}</h3>
              <p className="mt-2 font-sans text-[13px] leading-[1.55] text-muted-foreground">
                {item.note}
              </p>
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
    <section aria-label="Agents">
      <SectionMarker code="AGENTS" />
      <div className="border border-border-strong p-4">
        {surfaces.map((surface) => (
          <a
            key={surface.kind}
            href={surface.href}
            className="block border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <div className="flex items-center justify-between gap-4 text-[12px] tracking-[0.16em] uppercase">
              <span>{surface.label}</span>
              <span aria-hidden="true">↗</span>
            </div>
            <div className="mt-2 text-[11px] text-primary">{surface.target}</div>
            <p className="mt-2 font-sans text-[13px] leading-[1.55] text-subtle-foreground">
              {surface.note}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
