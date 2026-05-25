import type { ContactLink } from "./types";
import { RailBaselineRow } from "./RailRow";

interface HeaderProps {
  location: string;
  name: string;
  contactLinks: ContactLink[];
}

export function Header({ location, name, contactLinks }: HeaderProps) {
  const actionLinkClassName =
    "inline-flex h-[28px] w-[42px] items-center justify-center border-r border-primary text-[12px] leading-none tracking-[0.12em] text-primary uppercase no-underline transition-colors hover:bg-primary hover:text-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none last:border-r-0";
  const directLinks = contactLinks.filter((item) => item.group !== "profile");
  const profileLinks = contactLinks.filter((item) => item.group === "profile");

  return (
    <header className="mb-7 border-t border-b border-border py-6 [border-top-color:var(--border-strong)] print:[break-inside:avoid]">
      <div className="grid gap-y-[18px]">
        <RailBaselineRow
          label={
            <span className="inline-flex items-baseline gap-[10px]">
              <span className="inline-block size-[5px] bg-primary"></span>
              <span>CV</span>
            </span>
          }
          aside={
            <span
              className="inline-flex w-fit items-stretch justify-self-start border border-primary print:hidden md:justify-self-end"
              role="group"
              aria-label="Format"
            >
              <a className={actionLinkClassName} href="/resume.md" title="View in Markdown format">
                MD
              </a>
              <a
                className={actionLinkClassName}
                href="/mundi-morgado-resume.pdf"
                title="View in PDF format"
              >
                PDF
              </a>
            </span>
          }
          asideClassName="md:self-center"
          labelClassName="leading-none"
        >
          <h1 className="m-0 text-[28px] leading-[1.05] font-bold tracking-[-0.015em] text-foreground md:text-[34px]">
            {name}
          </h1>
        </RailBaselineRow>

        <RailBaselineRow label={location}>
          <address
            className="font-sans text-[15px] text-foreground not-italic"
            aria-label="Contact information"
          >
            <div className="grid gap-y-[7px]">
              <ContactLinkRow links={directLinks} />
              <ContactLinkRow links={profileLinks} />
            </div>
          </address>
        </RailBaselineRow>
      </div>
    </header>
  );
}

function ContactLinkRow({ links }: { links: ContactLink[] }) {
  if (links.length === 0) {
    return null;
  }

  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-[18px] gap-y-[6px] p-0">
      {links.map((item) => (
        <li
          className="flex min-w-0 max-w-full items-center gap-[18px] before:inline-block before:size-[5px] before:bg-primary before:content-[''] first:before:hidden"
          key={item.href}
        >
          <a
            className="min-w-0 max-w-full break-all leading-[1.2] no-underline hover:text-primary"
            href={item.href}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
