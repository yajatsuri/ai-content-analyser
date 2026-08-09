"use client";

import { useEffect, useMemo, useState } from "react";
import { Inbox, AlertCircle } from "lucide-react";
import { getImageHistory } from "@/lib/api";
import { HistoryCard } from "@/components/HistoryCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { SkeletonCard } from "@/components/ui/LoadingSpinner";
import type { AnalysisRecord, HistoryFilters } from "@/lib/types";

const DEFAULT_FILTERS: HistoryFilters = {
  query: "",
  prediction: "ALL",
  sort: "NEWEST",
};

export default function HistoryPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HistoryFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await getImageHistory();
        if (!cancelled) setRecords(data);
      } catch {
        if (!cancelled) {
          setLoadError("Couldn't load history. Check your connection and try again.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleRecords = useMemo(() => {
    let result = records;

    if (filters.prediction !== "ALL") {
      result = result.filter((r) => r.prediction === filters.prediction);
    }

    if (filters.query.trim()) {
      const q = filters.query.trim().toLowerCase();
      result = result.filter((r) => r.filename.toLowerCase().includes(q));
    }

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return filters.sort === "NEWEST" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [records, filters]);

  return (
    <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
          History
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          Every image you've analyzed, in one place.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchBar
          value={filters.query}
          onChange={(query) => setFilters((f) => ({ ...f, query }))}
        />
      </div>

      <div className="mb-6">
        <FilterBar
          prediction={filters.prediction}
          sort={filters.sort}
          onPredictionChange={(prediction) =>
            setFilters((f) => ({ ...f, prediction }))
          }
          onSortChange={(sort) => setFilters((f) => ({ ...f, sort }))}
          resultCount={visibleRecords.length}
        />
      </div>

      <div className="space-y-3">
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!isLoading && loadError && (
          <div className="flex flex-col items-center text-center py-16 text-[var(--color-muted)]">
            <AlertCircle className="h-8 w-8 mb-3 text-[var(--color-muted-light)]" strokeWidth={1.5} />
            <p className="text-sm">{loadError}</p>
          </div>
        )}

        {!isLoading && !loadError && visibleRecords.length === 0 && (
          <div className="flex flex-col items-center text-center py-16 text-[var(--color-muted)]">
            <Inbox className="h-8 w-8 mb-3 text-[var(--color-muted-light)]" strokeWidth={1.5} />
            <p className="text-sm">
              {records.length === 0
                ? "No analyses yet. Upload an image to get started."
                : "No results match your filters."}
            </p>
          </div>
        )}

        {!isLoading &&
          !loadError &&
          visibleRecords.map((record) => (
            <HistoryCard key={record.id} record={record} />
          ))}
      </div>
    </section>
  );
}
