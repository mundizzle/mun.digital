"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

interface C64BootTextProps {
  fontSize: number;
  fontSizeMd: number;
  inkColor: string;
  inkOpacity: number;
  lineHeight: number;
  mode: "titles" | "program";
  onProgramComplete: () => void;
  onTitlesComplete: () => void;
  roles: readonly string[];
}

const programLines = ["10 PRINT CHR$(205.5+RND(1));", "20 GOTO 10", "RUN"] as const;
const lineClassName = "h-[calc(1em*var(--c64-boot-line-height))]";

type C64BootTextStyle = CSSProperties & {
  "--c64-boot-line-height": string;
  "--c64-boot-text-size": string;
  "--c64-boot-text-size-md": string;
};

export function C64BootText({
  fontSize,
  fontSizeMd,
  inkColor,
  inkOpacity,
  lineHeight,
  mode,
  onProgramComplete,
  onTitlesComplete,
  roles,
}: C64BootTextProps) {
  const stableRoles = useMemo(() => roles.filter(Boolean), [roles]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [programLineIndex, setProgramLineIndex] = useState(0);
  const [programText, setProgramText] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => setPrefersReducedMotion(motionQuery.matches);

    handleMotionChange();
    motionQuery.addEventListener("change", handleMotionChange);

    return () => motionQuery.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    if (mode !== "titles" || stableRoles.length === 0) return;

    if (prefersReducedMotion) {
      onTitlesComplete();
      return;
    }

    if (roleIndex >= stableRoles.length) {
      onTitlesComplete();
      return;
    }

    const currentTitle = stableRoles[roleIndex] ?? "";
    if (text.length < currentTitle.length) {
      const timeout = window.setTimeout(() => {
        setText(currentTitle.slice(0, text.length + 1));
      }, 55);

      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      setRoleIndex((value) => value + 1);
      setText("");
    }, 950);

    return () => window.clearTimeout(timeout);
  }, [mode, onTitlesComplete, prefersReducedMotion, roleIndex, stableRoles, text]);

  useEffect(() => {
    if (mode !== "program") return;

    if (prefersReducedMotion) {
      onProgramComplete();
      return;
    }

    const currentLine = programLines[programLineIndex] ?? "";
    if (programLineIndex >= programLines.length) {
      onProgramComplete();
      return;
    }

    if (programText.length < currentLine.length) {
      const timeout = window.setTimeout(() => {
        setProgramText(currentLine.slice(0, programText.length + 1));
      }, 45);

      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      setProgramLineIndex((value) => value + 1);
      setProgramText("");
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [mode, onProgramComplete, prefersReducedMotion, programLineIndex, programText]);

  const titleText = prefersReducedMotion ? (stableRoles.at(-1) ?? "") : text;
  const visibleProgramLines = prefersReducedMotion && mode === "program" ? programLines : programLines.slice(0, programLineIndex);
  const showCaret = !prefersReducedMotion;

  return (
    <div
      aria-hidden="true"
      className="font-c64 text-[length:var(--c64-boot-text-size)] leading-[var(--c64-boot-line-height)] font-normal tracking-normal whitespace-pre uppercase [-webkit-font-smoothing:none] [font-smooth:never] [text-rendering:geometricPrecision] md:text-[length:var(--c64-boot-text-size-md)]"
      style={
        {
          "--c64-boot-line-height": String(lineHeight),
          "--c64-boot-text-size": `${fontSize}px`,
          "--c64-boot-text-size-md": `${fontSizeMd}px`,
          color: inkColor,
          opacity: inkOpacity,
        } as C64BootTextStyle
      }
    >
      <div className={lineClassName}>**** COMMODORE 64 BASIC V2 ****</div>
      <div className={lineClassName}>64K RAM SYSTEM&nbsp;&nbsp;38911 BASIC BYTES FREE</div>
      <div className="h-[1.05em]" />
      <div className={lineClassName}>READY.</div>
      {mode === "titles" ? (
        <div className={lineClassName}>
          {titleText}
          {showCaret ? <span className="typed-caret ml-1 inline-block h-[0.95em] w-0.5 translate-y-[0.08em] bg-current" /> : null}
        </div>
      ) : (
        <>
          {programLines.map((line, index) => {
            const isComplete = index < visibleProgramLines.length;
            const isTyping = index === programLineIndex && programLineIndex < programLines.length;

            return (
              <div className={lineClassName} key={line}>
                {isComplete ? line : null}
                {isTyping ? (
                  <>
                    {programText}
                    {showCaret ? (
                      <span className="typed-caret ml-1 inline-block h-[0.95em] w-0.5 translate-y-[0.08em] bg-current" />
                    ) : null}
                  </>
                ) : null}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
