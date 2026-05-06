import type { ContactLink } from "./types";
import { RailBaselineRow } from "./RailRow";

interface HeaderProps {
  location: string;
  name: string;
  contactLinks: ContactLink[];
}

export function Header({ location, name, contactLinks }: HeaderProps) {
  return (
    <header className="mb-7 border-t border-b border-rule py-6 [border-top-color:var(--rule-strong)] print:[break-inside:avoid]">
      <div className="grid gap-y-[18px]">
        <RailBaselineRow
          label={
            <span className="inline-flex items-baseline gap-[10px]">
              <span className="inline-block size-[7px] rounded-full bg-accent"></span>
              <span>CV</span>
            </span>
          }
          labelClassName="leading-none"
        >
          <h1 className="m-0 text-[28px] leading-[1.05] font-bold tracking-[-0.015em] text-ink md:text-[34px]">
            {name}
          </h1>
        </RailBaselineRow>

        <RailBaselineRow label={location}>
          <address
            className="font-sans text-[15px] text-ink not-italic"
            aria-label="Contact information"
          >
            <ul className="m-0 flex list-none flex-wrap gap-y-[6px] p-0">
              {contactLinks.map((item) => (
                <li
                  className="mr-[18px] flex min-w-0 max-w-full border-r border-rule pr-[18px] last:mr-0 last:border-r-0 last:pr-0"
                  key={item.href}
                >
                  <a
                    className="min-w-0 max-w-full break-all leading-[1.2] no-underline hover:text-accent"
                    href={item.href}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </address>
        </RailBaselineRow>
      </div>
    </header>
  );
}
