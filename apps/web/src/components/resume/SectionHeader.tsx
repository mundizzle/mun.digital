import { RailBaselineRow } from "./RailRow";

interface SectionHeaderProps {
  index: string;
  title: string;
}

export function SectionHeader({ index, title }: SectionHeaderProps) {
  return (
    <RailBaselineRow
      className="mb-[18px]"
      label={
        <>
          <span className="text-primary">[</span>
          {index}
          <span className="text-primary">]</span>
        </>
      }
    >
      <h2 className="m-0 text-[15px] leading-[1.2] font-semibold tracking-[0.24em] text-foreground uppercase">
        {title}
      </h2>
    </RailBaselineRow>
  );
}
