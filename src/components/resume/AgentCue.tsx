import { RailBaselineRow } from "./RailRow";

export function AgentCue() {
  return (
    <section className="relative border-t border-rule pt-6 pb-6 print:hidden" aria-label="Agent-readable profile">
      <RailBaselineRow label="Agent">
        <p className="m-0 max-w-[68ch] font-sans text-[13px] leading-[1.7] text-ink-dim">
          Agent-readable profile: <span className="font-semibold text-ink">mun-digital CLI</span>{" "}
          <span className="mx-[6px] font-normal text-ink-faint">{"//"}</span>{" "}
          <span className="font-semibold text-ink">MCP resource mun://resume</span>
        </p>
      </RailBaselineRow>
    </section>
  );
}
