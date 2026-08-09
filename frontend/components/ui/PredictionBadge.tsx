import type { PredictionLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BadgeProps {
  prediction: PredictionLabel;
  size?: "sm" | "md";
  className?: string;
}

/**
 * AI / REAL verdict badge.
 * Accent violet for "AI", green for "REAL" — the only two colors that
 * carry semantic meaning in this UI, deliberately scoped to this component.
 */
export function PredictionBadge({ prediction, size = "md", className }: BadgeProps) {
  const isAi = prediction === "AI";

  const sizeClasses =
    size === "sm" ? "text-xs px-2.5 py-1 gap-1.5" : "text-sm px-3.5 py-1.5 gap-2";

  const dotSize = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium font-sans border",
        sizeClasses,
        isAi
          ? "bg-[var(--color-ai-soft)] text-[var(--color-accent-hover)] border-transparent"
          : "bg-[var(--color-real-soft)] text-[var(--color-real)] border-transparent",
        className
      )}
      role="status"
      aria-label={isAi ? "AI generated image" : "Real image"}
    >
      <span
        className={cn(
          "rounded-full shrink-0",
          dotSize,
          isAi ? "bg-[var(--color-accent)]" : "bg-[var(--color-real)]"
        )}
        aria-hidden="true"
      />
      {isAi ? "AI Generated" : "Real Image"}
    </span>
  );
}
