"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export interface TenPrintProps {
  active?: boolean;
  cellsPerSecond?: number;
  cellSize?: number;
  className?: string;
  fillMode?: "scroll" | "stop";
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
  lineWidth?: number;
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  opacity?: number;
  strokeColor?: string;
}

export function TenPrint({
  active = true,
  cellsPerSecond = 32,
  cellSize = 14,
  className,
  fillMode = "scroll",
  lineCap = "round",
  lineJoin = "round",
  lineWidth = 2,
  onComplete,
  onProgress,
  opacity = 0.1,
  strokeColor,
}: TenPrintProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let column = 0;
    let lastFrameTime = 0;
    let drawAccumulator = 0;
    let context: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let columns = 1;
    let row = 0;
    let rows = 1;
    let complete = false;
    let notifiedComplete = false;

    const configureCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.ceil(rect.width * dpr);
      canvas.height = Math.ceil(rect.height * dpr);

      context = canvas.getContext("2d");
      if (!context) return false;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.strokeStyle = strokeColor ?? getComputedStyle(canvas).color;
      context.globalAlpha = opacity;
      context.lineWidth = lineWidth;
      context.lineCap = lineCap;
      context.lineJoin = lineJoin;
      columns = Math.max(Math.ceil(width / cellSize), 1);
      rows = Math.max(Math.ceil(height / cellSize), 1);
      column = 0;
      row = 0;
      complete = false;
      notifiedComplete = false;
      lastFrameTime = 0;
      drawAccumulator = 0;

      return true;
    };

    const clearCell = (x: number, y: number) => {
      if (!context) return;

      context.clearRect(x * cellSize, y * cellSize, cellSize, cellSize);
    };

    const drawCell = (x: number, y: number) => {
      if (!context) return;

      const px = x * cellSize;
      const py = y * cellSize;
      const inset = lineWidth / 2;

      context.beginPath();
      if (Math.random() < 0.5) {
        context.moveTo(px + inset, py + cellSize - inset);
        context.lineTo(px + cellSize - inset, py + inset);
      } else {
        context.moveTo(px + inset, py + inset);
        context.lineTo(px + cellSize - inset, py + cellSize - inset);
      }
      context.stroke();
    };

    const scrollUp = (pixels: number) => {
      if (!context) return;

      const scaledPixels = pixels * dpr;
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.globalAlpha = 1;
      context.globalCompositeOperation = "copy";
      context.drawImage(
        canvas,
        0,
        scaledPixels,
        canvas.width,
        Math.max(canvas.height - scaledPixels, 0),
        0,
        0,
        canvas.width,
        Math.max(canvas.height - scaledPixels, 0),
      );
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, Math.max(canvas.height - scaledPixels, 0), canvas.width, scaledPixels);
      context.restore();
    };

    const drawNextCell = () => {
      clearCell(column, row);
      drawCell(column, row);
      column += 1;

      if (column >= columns) {
        column = 0;
        if (fillMode === "scroll") {
          scrollUp(cellSize);
          for (let x = 0; x < columns; x += 1) {
            clearCell(x, row);
          }
        } else {
          row += 1;
          onProgress?.(Math.min(row / rows, 1));
          complete = row >= rows;
        }
      }
    };

    const fillStaticPattern = () => {
      if (!context) return;

      const rows = Math.ceil(height / cellSize) + 1;
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          drawCell(x, y);
        }
      }
    };

    const draw = (time: number) => {
      if (motionQuery.matches) return;
      if (complete) return;

      if (!lastFrameTime) {
        lastFrameTime = time;
      }

      drawAccumulator += ((time - lastFrameTime) / 1000) * cellsPerSecond;
      const cellsToDraw = Math.floor(drawAccumulator);

      for (let index = 0; index < cellsToDraw; index += 1) {
        if (complete) break;
        drawNextCell();
      }

      drawAccumulator -= cellsToDraw;
      lastFrameTime = time;
      if (complete) {
        if (!notifiedComplete) {
          notifiedComplete = true;
          onComplete?.();
        }
        return;
      }
      animationFrame = requestAnimationFrame(draw);
    };

    const reset = () => {
      cancelAnimationFrame(animationFrame);
      if (!configureCanvas()) return;
      onProgress?.(0);

      if (motionQuery.matches) {
        fillStaticPattern();
        onProgress?.(1);
        onComplete?.();
        return;
      }

      if (!active) return;

      if (fillMode === "scroll") {
        fillStaticPattern();
        row = Math.max(Math.ceil(height / cellSize) - 1, 0);
      } else {
        row = 0;
      }
      column = 0;
      animationFrame = requestAnimationFrame(draw);
    };

    reset();

    const observer = new ResizeObserver(reset);
    observer.observe(canvas.parentElement ?? canvas);
    motionQuery.addEventListener("change", reset);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      motionQuery.removeEventListener("change", reset);
    };
  }, [active, cellSize, cellsPerSecond, fillMode, lineCap, lineJoin, lineWidth, onComplete, onProgress, opacity, strokeColor]);

  return (
    <canvas
      ref={ref}
      className={cn("absolute inset-0 h-full w-full text-foreground", className)}
      aria-hidden="true"
    />
  );
}
