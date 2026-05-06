import type { Job } from "./types";
import { RailBaselineRow, RailDividerRow, RailInsetRow } from "./RailRow";
import { SectionHeader } from "./SectionHeader";

interface ExperienceProps {
  index: string;
  title: string;
  jobs: Job[];
}

export function Experience({ index, title, jobs }: ExperienceProps) {
  return (
    <section
      className="relative border-t border-rule pt-6 pb-6 print:[break-inside:avoid]"
      id="experience"
      aria-labelledby="experience-title"
    >
      <SectionHeader index={index} title={title} />

      {jobs.map((job, jobIndex) => (
        <article
          className={`border-t border-rule py-[22px] ${jobIndex === 0 ? "border-t-0 pt-2" : ""}`}
          key={`${job.title}-${job.dates}`}
        >
          <RailBaselineRow
            label={
              <div>
                <p className="m-0 block text-ink-dim [font-variant-numeric:tabular-nums]">
                  {job.dates}
                </p>
                {job.tenure ? (
                  <p className="mt-0.5 block text-[11px] leading-[1.3] text-ink-faint">
                    {job.tenure}
                  </p>
                ) : null}
              </div>
            }
          >
            <div>
              <header className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                <h3 className="m-0 text-[18px] font-semibold tracking-[-0.005em] text-ink">
                  {job.title}
                </h3>
                <p className="m-0 text-[18px] leading-[1.3]">
                  <span className="mx-[6px] font-normal text-ink-faint">{"//"}</span>{" "}
                  <span className="font-semibold text-accent">
                    {job.companyUrl ? (
                      <a className="text-inherit no-underline hover:underline" href={job.companyUrl}>
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </span>
                </p>
              </header>

              <p className="my-2 mb-[14px] font-sans text-[15px] leading-[1.6] text-ink-dim">
                {job.context}
              </p>

              {job.bullets.length > 0 ? (
                <ul className="m-0 list-none p-0 font-sans">
                  {job.bullets.map((bullet, bulletIndex) => (
                    <li
                      className="relative mb-[10px] pl-[22px] text-[15px] before:absolute before:left-0 before:font-medium before:text-accent before:content-['—']"
                      key={`${job.title}-bullet-${bulletIndex}`}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </RailBaselineRow>

          {job.selectedWork.length > 0 ? (
            <RailInsetRow
              className="mt-4 md:mt-2"
              contentClassName="grid gap-3 pt-[18px]"
              insetClassName="pt-[18px]"
              label={<h4 className="m-0 text-inherit">Selected Work</h4>}
            >
              <ul className="m-0 grid list-none gap-3 p-0">
                {job.selectedWork.map((item, itemIndex) => (
                  <li
                    className="border-l-2 border-accent bg-surface px-[14px] py-[10px] font-sans text-[15px] leading-[1.6] text-ink-dim"
                    key={`${job.title}-work-${itemIndex}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </RailInsetRow>
          ) : null}

          {job.selectedClients.length > 0 ? (
            <RailDividerRow
              className="mt-4 md:mt-2"
              contentClassName="font-sans text-[15px] leading-[1.7] text-ink-dim"
              label={<h4 className="m-0 text-inherit">Selected Clients</h4>}
            >
              <ul className="m-0 flex list-none flex-wrap gap-x-[8px] gap-y-[2px] p-0">
                {job.selectedClients.map((client) => (
                  <li
                    className="inline-flex items-center gap-[8px] before:font-medium before:text-accent before:content-['—']"
                    key={`${job.title}-client-${client}`}
                  >
                    {client}
                  </li>
                ))}
              </ul>
            </RailDividerRow>
          ) : null}
        </article>
      ))}
    </section>
  );
}
