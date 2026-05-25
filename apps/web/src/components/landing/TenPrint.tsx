"use client";

import { useEffect, useRef } from "react";

export function TenPrint() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(rect.width * dpr);
      canvas.height = Math.ceil(rect.height * dpr);

      const context = canvas.getContext("2d");
      if (!context) return;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
      context.strokeStyle = getComputedStyle(canvas).color;
      context.globalAlpha = 0.1;
      context.lineWidth = 1;
      context.lineCap = "round";

      const cell = 14;
      const cols = Math.ceil(rect.width / cell) + 1;
      const rows = Math.ceil(rect.height / cell) + 1;

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const px = x * cell;
          const py = y * cell;
          context.beginPath();
          if (Math.random() < 0.5) {
            context.moveTo(px, py + cell);
            context.lineTo(px + cell, py);
          } else {
            context.moveTo(px, py);
            context.lineTo(px + cell, py + cell);
          }
          context.stroke();
        }
      }
    };

    draw();

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full text-foreground"
      aria-hidden="true"
    />
  );
}
