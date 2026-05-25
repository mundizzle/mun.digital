"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useState } from "react";
import { hero, heroRoles } from "@/content/portfolio";
import { C64BootText } from "./C64BootText";
import { TenPrint, type TenPrintProps } from "./TenPrint";

// const c64BackgroundColor = "var(--primary)";
const c64BackgroundColor = "color-mix(in oklab, var(--primary) 80%, white)";
const c64InkColor = "var(--card)";
const c64InkOpacity = 0.5;
// `md` applies at desktop widths, so tweak both values when judging in browser.
const c64BootTextSize = 8;
const c64BootTextSizeMd = 8;
const c64BootLineHeight = 1.18;
const c64BootTextTop = 16;
const c64BootTextTopMd = 20;
const c64PatternLineOffset = 7.35;
const c64PatternTopMin = 86;
const c64PatternTopMinMd = 90;
// These values are paired: the C64 layer is taller than the visible hero so the
// completed tile field can push the boot text fully out of view.
const c64ScrollOffset = 166;
const c64LayerExtraHeight = 168;
const c64PatternTop = Math.max(
  c64PatternTopMin,
  Math.round(
    c64BootTextTop + c64BootTextSize * c64BootLineHeight * c64PatternLineOffset,
  ),
);
const c64PatternTopMd = Math.max(
  c64PatternTopMinMd,
  Math.round(
    c64BootTextTopMd +
      c64BootTextSizeMd * c64BootLineHeight * c64PatternLineOffset,
  ),
);

const heroPattern: TenPrintProps = {
  // Tweak the C64 pattern from here while iterating on the hero.
  cellsPerSecond: 52,
  cellSize: 14,
  lineCap: "round",
  lineJoin: "round",
  lineWidth: 3,
  opacity: c64InkOpacity,
  strokeColor: c64InkColor,
};

export function HeroCard() {
  const [phase, setPhase] = useState<
    "titles" | "program" | "pattern" | "complete"
  >("titles");
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
        className="relative left-1/2 mb-8 min-h-[190px] w-screen -translate-x-1/2 overflow-hidden border-b border-border/60 md:mb-12 md:min-h-[210px]"
        style={{ backgroundColor: c64BackgroundColor }}
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
          <div
            className="relative z-[1] mx-auto h-full max-w-[1180px] px-5 md:px-8"
            style={
              {
                "--c64-boot-top": `${c64BootTextTop}px`,
                "--c64-boot-top-md": `${c64BootTextTopMd}px`,
                "--c64-pattern-top": `${c64PatternTop}px`,
                "--c64-pattern-top-md": `${c64PatternTopMd}px`,
              } as CSSProperties
            }
          >
            <div className="absolute top-[var(--c64-boot-top)] right-9 left-[194px] sm:left-[224px] md:top-[var(--c64-boot-top-md)] md:right-14 md:left-[266px]">
              <C64BootText
                fontSize={c64BootTextSize}
                fontSizeMd={c64BootTextSizeMd}
                inkColor={c64InkColor}
                inkOpacity={c64InkOpacity}
                lineHeight={c64BootLineHeight}
                mode={phase === "titles" ? "titles" : "program"}
                onProgramComplete={handleProgramComplete}
                onTitlesComplete={handleTitlesComplete}
                roles={heroRoles}
              />
            </div>
            <div className="absolute right-9 bottom-[-4px] left-[194px] top-[var(--c64-pattern-top)] sm:left-[224px] md:right-14 md:left-[266px] md:top-[var(--c64-pattern-top-md)]">
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
