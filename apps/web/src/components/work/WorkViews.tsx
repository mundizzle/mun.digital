import Link from "next/link";
import { SectionHeader } from "@/components/resume/SectionHeader";
import type { WorkItem } from "@/content/portfolio";

export function WorkIndex({ items }: { items: readonly WorkItem[] }) {
  return (
    <main>
      <section className="section section--first">
        <SectionHeader index="00" title="Work" />
        <div className="grid">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/work/${item.id}`}
              className="grid gap-4 border-t border-border py-5 text-foreground last:border-b md:grid-cols-[72px_128px_1fr_auto] md:items-center"
            >
              <div className="text-[11px] tracking-[0.18em] text-subtle-foreground uppercase">
                {item.year}
              </div>
              <div
                className="grid aspect-[16/10] place-items-end border border-border bg-card p-2 text-[9px] tracking-[0.16em] text-subtle-foreground uppercase"
                aria-hidden="true"
              >
                {item.id}
              </div>
              <div>
                <h2 className="m-0 text-[18px] leading-tight font-semibold tracking-normal">
                  {item.title}
                  <span className="mx-2 text-subtle-foreground">{"//"}</span>
                  <span className="font-normal text-muted-foreground">{item.client}</span>
                </h2>
                <p className="mt-2 font-sans text-[14px] leading-[1.55] text-muted-foreground">
                  {item.role}
                </p>
              </div>
              <div className="text-[10px] tracking-[0.18em] text-primary uppercase">
                {item.tag}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export function CaseStudy({ item }: { item: WorkItem }) {
  return (
    <main>
      <section className="section section--first">
        <Link
          href="/work"
          className="mb-5 inline-block text-[11px] tracking-[0.18em] text-primary uppercase hover:text-foreground"
        >
          ← All work
        </Link>
        <div className="grid gap-5 md:grid-cols-[var(--rail-width)_1fr_auto] md:items-start">
          <div className="text-[11px] tracking-[0.18em] text-subtle-foreground uppercase">
            {item.year} · {item.tag}
          </div>
          <div>
            <h1 className="m-0 text-[clamp(2.35rem,1.75rem+2.4vw,4.5rem)] leading-[0.95] font-semibold tracking-normal">
              {item.title}
            </h1>
            <p className="mt-3 font-sans text-[17px] text-muted-foreground">{item.client}</p>
          </div>
          <div className="flex gap-2 text-[10px] tracking-[0.18em] uppercase">
            <a className="border border-border px-3 py-2 text-primary hover:border-primary" href="#">
              Live
            </a>
            <a className="border border-border px-3 py-2 text-primary hover:border-primary" href="#">
              GH
            </a>
          </div>
        </div>
      </section>

      <div className="my-9 grid aspect-video place-items-center border border-border bg-card text-[10px] tracking-[0.18em] text-subtle-foreground uppercase">
        [ project hero · 16:9 · drop image here ]
      </div>

      <section className="section">
        <SectionHeader index="01" title="Overview" />
        <div className="grid gap-8 md:grid-cols-[var(--rail-width)_1fr_220px] md:items-start">
          <div />
          <div className="prose prose-invert max-w-none font-sans text-muted-foreground">
            <p>{item.summary}</p>
            <h3>Role</h3>
            <p>{item.role}.</p>
            <h3>What we shipped</h3>
            <ul>
              <li>Front-end architecture decisions documented and adopted by the broader team.</li>
              <li>A component layer reusable across product and marketing surfaces.</li>
              <li>A token and theming pipeline that survived rebrands without engineering rework.</li>
            </ul>
          </div>
          <div className="border border-border bg-card">
            {item.facts.map(([key, value]) => (
              <div key={key} className="border-b border-border p-3 last:border-b-0">
                <div className="text-[10px] tracking-[0.18em] text-subtle-foreground uppercase">
                  {key}
                </div>
                <div className="mt-1 font-sans text-[13px] leading-[1.45] text-foreground">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeader index="02" title="Notes" />
        <div className="grid gap-4 md:grid-cols-[var(--rail-width)_1fr]">
          <div className="text-[11px] tracking-[0.18em] text-subtle-foreground uppercase">
            Detail
          </div>
          <p className="m-0 font-sans text-[15px] leading-[1.8] text-muted-foreground">
            Full case study available on request. mun.digital case studies stay light
            intentionally; most client work is under NDA.
          </p>
        </div>
      </section>
    </main>
  );
}
