import { SectionHeader as SharedSectionHeader } from "@mun.digital/ui";

interface SectionHeaderProps {
  index: string;
  title: string;
}

export function SectionHeader({ index, title }: SectionHeaderProps) {
  return (
    <SharedSectionHeader
      index={index}
      title={title}
      className="mb-[18px]"
      label={
        <>
          <span className="text-primary">[</span>
          {index}
          <span className="text-primary">]</span>
        </>
      }
    />
  );
}
