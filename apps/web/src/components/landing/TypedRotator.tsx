"use client";

import { useEffect, useMemo, useState } from "react";

interface TypedRotatorProps {
  items: readonly string[];
}

export function TypedRotator({ items }: TypedRotatorProps) {
  const stableItems = useMemo(() => items.filter(Boolean), [items]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(stableItems[0] ?? "");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || stableItems.length === 0) {
      return;
    }

    const current = stableItems[index] ?? stableItems[0] ?? "";
    let delay = 70;
    let next = () => setText(current.slice(0, text.length + 1));

    if (phase === "typing" && text.length >= current.length) {
      delay = 2800;
      next = () => setPhase("deleting");
    } else if (phase === "deleting" && text.length > 0) {
      delay = 38;
      next = () => setText(current.slice(0, text.length - 1));
    } else if (phase === "deleting") {
      delay = 320;
      next = () => {
        setIndex((value) => (value + 1) % stableItems.length);
        setPhase("typing");
      };
    } else if (phase === "holding") {
      next = () => setPhase("deleting");
    }

    const timeout = window.setTimeout(next, delay);
    return () => window.clearTimeout(timeout);
  }, [index, phase, prefersReducedMotion, stableItems, text]);

  const displayText = prefersReducedMotion ? (stableItems[0] ?? "") : text;

  return (
    <span>
      <span className="sr-only">{stableItems[0] ?? ""}</span>
      <span className="text-subtle-foreground" aria-hidden="true">
        ▸{" "}
      </span>
      <span aria-hidden="true">{displayText}</span>
      <span className="typed-caret ml-1 inline-block h-[1.15em] w-0.5 translate-y-0.5 bg-primary" aria-hidden="true" />
    </span>
  );
}
