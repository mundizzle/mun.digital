"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { WorkItem } from "@/content/portfolio";

interface WorkTilesProps {
  items: readonly WorkItem[];
}

function shuffle(items: readonly WorkItem[]) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
}

export function WorkTiles({ items }: WorkTilesProps) {
  const [visible, setVisible] = useState(() => items.slice(0, 2));

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisible(shuffle(items).slice(0, 2));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [items]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {visible.map((item) => (
        <Link
          key={item.id}
          href={`/work/${item.id}`}
          className="group flex min-h-[285px] flex-col border border-border/60 bg-card p-4 transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <div className="mb-5 grid aspect-[16/9] place-items-end border border-border/60 bg-background p-3 text-[10px] tracking-[0.18em] text-subtle-foreground uppercase">
            {item.id}
          </div>
          <div className="text-[10px] tracking-[0.2em] text-primary uppercase">{item.tag}</div>
          <h3 className="mt-3 text-[18px] leading-tight font-semibold tracking-normal text-foreground">
            {item.title}
          </h3>
          <p className="mt-3 line-clamp-4 font-sans text-[14px] leading-[1.55] text-muted-foreground">
            {item.summary}
          </p>
        </Link>
      ))}
    </div>
  );
}
