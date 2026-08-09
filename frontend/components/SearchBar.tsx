"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Search input for filtering history by filename.
 * Controlled component — parent (history page) owns the query state
 * so it can be combined with prediction/sort filters in one place.
 */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search by filename...",
}: SearchBarProps) {
  return (
    <div className="relative flex-1 min-w-[220px]">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted)]"
        strokeWidth={2}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search history by filename"
        className="w-full rounded-full border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-9 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted-light)] transition-colors focus:border-[var(--color-accent)] outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)] transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}
