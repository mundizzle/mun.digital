import { cn } from "@/lib/cn";

interface SectionMarkerProps {
  code: string;
  className?: string;
}

export function SectionMarker({ code, className }: SectionMarkerProps) {
  return (
    <div
      className={cn(
        "mb-5 flex items-center gap-3 text-[11px] leading-none tracking-[0.2em] text-subtle-foreground uppercase",
        className,
      )}
    >
      <span>
        <span className="text-primary">[</span>
        {code}
        <span className="text-primary">]</span>
      </span>
      <span className="h-px min-w-8 flex-1 border-t border-dashed border-border" />
    </div>
  );
}
