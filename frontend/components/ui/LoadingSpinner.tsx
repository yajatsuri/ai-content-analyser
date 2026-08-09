import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

/**
 * Minimal ring spinner for inline/button loading states.
 * For the main analyze-in-progress state, see the scan beam in
 * UploadCard instead — this is for smaller, secondary loading moments.
 */
export function LoadingSpinner({
  size = "md",
  label = "Loading",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-9 w-9 border-[3px]",
  }[size];

  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-[var(--color-border-strong)] border-t-[var(--color-accent)]",
        sizeClasses,
        className
      )}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}

/**
 * Skeleton block for history cards while data is loading.
 * Uses the shimmer keyframe defined in globals.css.
 */
export function SkeletonCard() {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex gap-4">
      <div className="h-16 w-16 rounded-lg animate-skeleton shrink-0" />
      <div className="flex-1 space-y-2.5 py-1">
        <div className="h-4 w-3/5 rounded animate-skeleton" />
        <div className="h-3 w-2/5 rounded animate-skeleton" />
        <div className="h-3 w-1/3 rounded animate-skeleton" />
      </div>
    </div>
  );
}
