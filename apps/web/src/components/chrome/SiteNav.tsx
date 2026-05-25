"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@mun.digital/ui";

const links = [
  { href: "/", label: "Home" },
  { href: "/resume", label: "Resume" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="relative z-[2] border-b border-border/70 bg-background/88 backdrop-blur-sm print:hidden">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
        <Link
          href="/"
          className="group inline-flex w-fit items-baseline text-[15px] leading-none font-semibold tracking-[0.04em] text-foreground"
          aria-label="mun.digital home"
        >
          <span>mun</span>
          <span className="text-primary">.</span>
          <span>digital</span>
        </Link>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-[11px] leading-none tracking-[0.18em] uppercase">
          {links.map((link, index) => {
            const active = isActive(pathname, link.href);
            const number = String(index + 1).padStart(2, "0");

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative inline-flex min-h-6 items-center gap-2 text-subtle-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
                  active && "text-foreground",
                )}
              >
                <span>
                  <span className={cn("text-primary transition-colors", active && "text-foreground")}>
                    [
                  </span>
                  {number}
                  <span className={cn("text-primary transition-colors", active && "text-foreground")}>
                    ]
                  </span>
                </span>
                <span>{link.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100",
                    active && "h-0.5 scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
