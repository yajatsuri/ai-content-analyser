"use client";

import { useEffect, useState } from "react";
import type { PredictionLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0..100 */
  percent: number;
  prediction?: PredictionLabel;
  /** Animate fill from 0 on mount — used for the result reveal. */
  animateOnMount?: boolean;
  className?: string;
}

/**
 * Confidence progress bar.
 * Fill color matches the verdict (violet for AI, green for REAL).
 * On mount, fills from 0 -> percent to echo the "scan resolving into
 * a verdict" motif used in UploadCard.
 */
export function ProgressBar({
  percent,
  prediction,
  animateOnMount = true,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const [width, setWidth] = useState(animateOnMount ? 0 : clamped);

  useEffect(() => {
    if (!animateOnMount) {
      setWidth(clamped);
      return;
    }
    const frame = requestAnimationFrame(() => setWidth(clamped));
    return () => cancelAnimationFrame(frame);
  }, [clamped, animateOnMount]);

  const fillColor =
    prediction === "REAL" ? "bg-[var(--color-real)]" : "bg-[var(--color-accent)]";

  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Confidence score"
    >
      <div className="h-2 w-full rounded-full bg-[var(--color-surface-hover)] overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-1000 ease-out",
            fillColor
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
