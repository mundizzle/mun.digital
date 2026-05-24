import { RailBaselineRow } from "./RailRow";

export function AgentCue() {
  return (
    <section className="relative border-t border-border pt-6 pb-6 print:hidden" aria-label="Agent-readable profile">
      <RailBaselineRow label="Agent">
        <p className="m-0 max-w-[68ch] font-sans text-[13px] leading-[1.7] text-muted-foreground">
          Agent-readable profile: <span className="font-semibold text-foreground">@mun.digital/cli</span>{" "}
          <span className="mx-[6px] font-normal text-subtle-foreground">{"//"}</span>{" "}
          <span className="font-semibold text-foreground">MCP endpoint /api/mcp</span>{" "}
          <span className="mx-[6px] font-normal text-subtle-foreground">{"//"}</span>{" "}
          <span className="font-semibold text-foreground">tools search/fetch</span>
        </p>
      </RailBaselineRow>
    </section>
  );
}
