import { cn } from "@mun.digital/ui";
import type { ReactNode } from "react";

interface PageFrameProps {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}

export function PageFrame({ children, wide = false, className }: PageFrameProps) {
  return (
    <div
      className={cn(
        "relative z-[1] mx-auto w-full min-w-0 overflow-x-hidden px-5 pt-10 pb-16 md:px-8 md:pt-12 md:pb-24 print:max-w-none print:px-0 print:pt-0 print:pb-0",
        wide ? "max-w-[1180px]" : "max-w-[860px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
