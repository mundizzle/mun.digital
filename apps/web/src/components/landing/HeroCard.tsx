"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useState } from "react";
import { hero, heroRoles } from "@/content/portfolio";
import { C64BootText } from "./C64BootText";
import { TenPrint, type TenPrintProps } from "./TenPrint";

const c64InkColor = "var(--foreground)";
// These values are paired: the C64 layer is taller than the visible hero so the
// completed tile field can push the boot text fully out of view.
const c64ScrollOffset = 166;
const c64LayerExtraHeight = 168;

const heroPattern: TenPrintProps = {
  // Tweak the C64 pattern from here while iterating on the hero.
  cellsPerSecond: 52,
  cellSize: 14,
  lineCap: "round",
  lineJoin: "round",
  lineWidth: 3,
  opacity: 0.2,
  strokeColor: c64InkColor,
};

export function HeroCard() {
  const [phase, setPhase] = useState<"titles" | "program" | "pattern" | "complete">("titles");
  const [patternProgress, setPatternProgress] = useState(0);
  const screenOffset = Math.round(patternProgress * c64ScrollOffset);

  const handleTitlesComplete = useCallback(() => {
    setPhase("program");
  }, []);

  const handleProgramComplete = useCallback(() => {
    setPhase("pattern");
  }, []);

  const handlePatternComplete = useCallback(() => {
    setPhase("complete");
    setPatternProgress(1);
  }, []);

  return (
    <>
      <h1 id="hero-title" className="sr-only">
        {hero.title}
      </h1>
      <section
        aria-labelledby="hero-title"
        className="relative left-1/2 mb-8 min-h-[190px] w-screen -translate-x-1/2 overflow-hidden border-b border-border/60 bg-card md:mb-12 md:min-h-[210px]"
      >
        <div
          className="absolute inset-x-0 top-0 h-[calc(100%+var(--c64-layer-extra-height))] transition-transform duration-100 ease-linear"
          style={
            {
              "--c64-layer-extra-height": `${c64LayerExtraHeight}px`,
              transform: `translateY(-${screenOffset}px)`,
            } as CSSProperties
          }
        >
          <div className="relative z-[1] mx-auto h-full max-w-[1180px] px-5 md:px-8">
            <div className="absolute top-4 right-9 left-[194px] sm:left-[224px] md:top-5 md:right-14 md:left-[266px]">
              <C64BootText
                inkColor={c64InkColor}
                mode={phase === "titles" ? "titles" : "program"}
                onProgramComplete={handleProgramComplete}
                onTitlesComplete={handleTitlesComplete}
                roles={heroRoles}
              />
            </div>
            <div className="absolute right-9 bottom-[-4px] left-[194px] top-[134px] sm:left-[224px] md:right-14 md:left-[266px] md:top-[154px]">
              <TenPrint
                {...heroPattern}
                active={phase === "pattern" || phase === "complete"}
                onComplete={handlePatternComplete}
                onProgress={setPatternProgress}
              />
            </div>
          </div>
        </div>
        <div className="relative z-[2] mx-auto min-h-[190px] max-w-[1180px] px-5 md:min-h-[210px] md:px-8">
          <Image
            src="/images/mundi.png"
            alt=""
            width={210}
            height={210}
            priority
            className="absolute top-0 bottom-0 left-5 h-full w-[150px] object-cover sm:w-[180px] md:left-8 md:w-[210px]"
          />
        </div>
      </section>
    </>
  );
}
