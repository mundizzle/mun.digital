"use client";

import { useEffect, useMemo, useState } from "react";

interface C64BootTextProps {
  inkColor: string;
  mode: "titles" | "program";
  onProgramComplete: () => void;
  onTitlesComplete: () => void;
  roles: readonly string[];
}

const programLines = ["10 PRINT CHR$(205.5+RND(1));", "20 GOTO 10", "RUN"] as const;
const lineClassName = "h-[1.18em]";

export function C64BootText({ inkColor, mode, onProgramComplete, onTitlesComplete, roles }: C64BootTextProps) {
  const stableRoles = useMemo(() => roles.filter(Boolean), [roles]);
  const [roleIndex, setRoleIndex] = useState(0);
  const [programLineIndex, setProgramLineIndex] = useState(0);
  const [programText, setProgramText] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (mode !== "titles" || stableRoles.length === 0) return;

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
  }, [mode, onTitlesComplete, roleIndex, stableRoles, text]);

  useEffect(() => {
    if (mode !== "program") return;

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
  }, [mode, onProgramComplete, programLineIndex, programText]);

  const visibleProgramLines = programLines.slice(0, programLineIndex);

  return (
    <div
      aria-hidden="true"
      className="font-c64 text-[14px] leading-[1.18] font-normal tracking-normal whitespace-pre uppercase opacity-[0.45] [-webkit-font-smoothing:none] [font-smooth:never] [text-rendering:geometricPrecision] md:text-[16px]"
      style={{ color: inkColor }}
    >
      <div className={lineClassName}>**** COMMODORE 64 BASIC V2 ****</div>
      <div className={lineClassName}>64K RAM SYSTEM&nbsp;&nbsp;38911 BASIC BYTES FREE</div>
      <div className="h-[1.05em]" />
      <div className={lineClassName}>READY.</div>
      {mode === "titles" ? (
        <div className={lineClassName}>
          {text}
          <span className="typed-caret ml-1 inline-block h-[0.95em] w-0.5 translate-y-[0.08em] bg-current" />
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
                    <span className="typed-caret ml-1 inline-block h-[0.95em] w-0.5 translate-y-[0.08em] bg-current" />
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
