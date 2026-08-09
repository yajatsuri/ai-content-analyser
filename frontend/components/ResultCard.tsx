"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { PredictionBadge } from "@/components/ui/PredictionBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatConfidence, confidenceToPercent } from "@/lib/utils";
import type { PredictionLabel } from "@/lib/types";

interface ResultCardProps {
  prediction: PredictionLabel;
  confidence: number;
  filename?: string;
  onAnalyzeAnother: () => void;
}

/**
 * The verdict card shown after analysis completes.
 * Layout deliberately mirrors the brief's example: label -> value pairs
 * for Prediction and Confidence, with a bar instead of block characters.
 */
export function ResultCard({
  prediction,
  confidence,
  filename,
  onAnalyzeAnother,
}: ResultCardProps) {
  const isAi = prediction === "AI";
  const percent = confidenceToPercent(confidence);

  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-6 sm:p-8 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div
            className={
              "flex h-9 w-9 items-center justify-center rounded-full " +
              (isAi ? "bg-[var(--color-ai-soft)]" : "bg-[var(--color-real-soft)]")
            }
          >
            {isAi ? (
              <Sparkles className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2} />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-[var(--color-real)]" strokeWidth={2} />
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
              Result
            </p>
            {filename && (
              <p className="text-sm text-[var(--color-ink)] font-medium truncate max-w-[220px]">
                {filename}
              </p>
            )}
          </div>
        </div>

        <PredictionBadge prediction={prediction} />
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-[var(--color-muted)]">Prediction</span>
            <span className="text-sm font-semibold text-[var(--color-ink)]">
              {isAi ? "AI Generated" : "Real Image"}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-[var(--color-muted)]">Confidence</span>
            <span className="text-lg font-semibold font-mono text-[var(--color-ink)] font-tabular">
              {formatConfidence(confidence)}
            </span>
          </div>
          <ProgressBar percent={percent} prediction={prediction} />
        </div>
      </div>

      <button
        type="button"
        onClick={onAnalyzeAnother}
        className="mt-7 w-full rounded-full border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface)]"
      >
        Analyze another image
      </button>
    </motion.div>
  );
}
