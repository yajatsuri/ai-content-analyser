import { PredictionBadge } from "@/components/ui/PredictionBadge";
import { formatConfidence, formatDateShort, truncateFilename } from "@/lib/utils";
import type { AnalysisRecord } from "@/lib/types";

interface HistoryCardProps {
  record: AnalysisRecord;
}

/**
 * A single history entry, rendered as a card rather than a table row.
 * Thumbnail is served by the backend's static resource handler at
 * /uploads/users/{userId}/{filename} — record.imageUrl is the full URL.
 */
export function HistoryCard({ record }: HistoryCardProps) {
  return (
    <div className="group flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-4 transition-all duration-200 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)]">

      <img
        src={record.imageUrl}
        alt={record.filename}
        className="h-14 w-14 shrink-0 rounded-[calc(var(--radius-card)-4px)] object-cover border border-[var(--color-border)]"
        loading="lazy"
        onError={(e) => {
          // Falls back gracefully if the file is missing/unreachable instead of showing a broken-image icon
          (e.target as HTMLImageElement).style.visibility = "hidden";
        }}
      />

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium text-[var(--color-ink)] truncate"
          title={record.filename}
        >
          {truncateFilename(record.filename)}
        </p>
        <p className="text-xs text-[var(--color-muted)] font-mono mt-0.5">
          {formatDateShort(record.createdAt)}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-semibold font-mono text-[var(--color-ink)] font-tabular">
          {formatConfidence(record.confidence)}
        </span>
        <PredictionBadge prediction={record.prediction} size="sm" />
      </div>
    </div>
  );
}