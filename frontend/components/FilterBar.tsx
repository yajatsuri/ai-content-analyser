"use client";

import { cn } from "@/lib/utils";
import type { PredictionFilter, SortOrder } from "@/lib/types";

interface FilterBarProps {
  prediction: PredictionFilter;
  sort: SortOrder;
  onPredictionChange: (value: PredictionFilter) => void;
  onSortChange: (value: SortOrder) => void;
  resultCount: number;
}

const PREDICTION_OPTIONS: { value: PredictionFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "AI", label: "AI" },
  { value: "REAL", label: "Real" },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "NEWEST", label: "Newest" },
  { value: "OLDEST", label: "Oldest" },
];

/**
 * Prediction filter (segmented control) + sort order (segmented control),
 * plus a live result count so filtering feels responsive even before
 * the list visibly changes.
 */
export function FilterBar({
  prediction,
  sort,
  onPredictionChange,
  onSortChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          options={PREDICTION_OPTIONS}
          value={prediction}
          onChange={onPredictionChange}
          ariaLabel="Filter by prediction"
        />
        <div className="h-5 w-px bg-[var(--color-border)] mx-1 hidden sm:block" aria-hidden="true" />
        <Segmented
          options={SORT_OPTIONS}
          value={sort}
          onChange={onSortChange}
          ariaLabel="Sort by date"
        />
      </div>

      <p className="text-sm text-[var(--color-muted)] font-mono font-tabular">
        {resultCount} {resultCount === 1 ? "result" : "results"}
      </p>
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1"
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-white text-[var(--color-ink)] shadow-[var(--shadow-card)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
