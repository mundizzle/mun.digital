import type { ReactNode } from "react";
import { cn } from "./utils/cn";

export interface SectionHeaderProps {
  index: string;
  title: string;
  label?: ReactNode;
  className?: string;
  labelClassName?: string;
  titleClassName?: string;
}

export function SectionHeader({
  index,
  title,
  label,
  className,
  labelClassName,
  titleClassName,
}: SectionHeaderProps) {
  const fallbackLabel = (
    <>
      <span className="text-primary">[</span>
      {index}
      <span className="text-primary">]</span>
    </>
  );

  return (
    <div
      className={cn(
        "grid gap-[10px] md:items-baseline md:gap-[var(--rail-gap)] md:[grid-template-columns:var(--rail-width)_1fr]",
        className,
      )}
    >
      <div
        className={cn(
          "break-words text-[11px] leading-[1.35] tracking-[0.2em] text-subtle-foreground uppercase md:self-baseline",
          labelClassName,
        )}
      >
        {label ?? fallbackLabel}
      </div>
      <h2
        className={cn(
          "m-0 text-[15px] leading-[1.2] font-semibold tracking-[0.24em] text-foreground uppercase",
          titleClassName,
        )}
      >
        {title}
      </h2>
    </div>
  );
}
