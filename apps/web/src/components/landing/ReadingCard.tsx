import type { ReadingLink } from "../../content/reading";

export function ReadingCard({ item }: { item: ReadingLink }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 border border-border/60 bg-card p-4 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <div className="min-w-0 flex-1">
        <div className="text-[10px] tracking-[0.18em] text-primary uppercase">
          {item.tags[0]}
        </div>
        <h3 className="mt-2 text-[14px] leading-snug font-semibold">{item.title}</h3>
        {item.note ? (
          <p className="mt-2 line-clamp-2 font-sans text-[13px] leading-[1.55] text-muted-foreground">
            {item.note}
          </p>
        ) : null}
        <div className="mt-3 text-[10px] tracking-[0.16em] text-subtle-foreground uppercase">
          {item.domain}
        </div>
      </div>
      {item.thumbnailUrl ? (
        // Arbitrary Raindrop/source hosts make next/image remotePatterns too broad for this surface.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.thumbnailUrl}
          alt=""
          width="64"
          height="48"
          loading="lazy"
          decoding="async"
          className="mt-0.5 h-12 w-16 shrink-0 border border-border/60 object-cover"
        />
      ) : null}
    </a>
  );
}
