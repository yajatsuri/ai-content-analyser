"use client";

import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, ScanLine } from "lucide-react";
import { analyzeImage } from "@/lib/api";
import { ResultCard } from "@/components/ResultCard";
import { formatFileSize, cn } from "@/lib/utils";
import type { AnalyzeImageResponse, StagedFile, UploadStatus } from "@/lib/types";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB, frontend guard only — backend is source of truth

export function UploadCard() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [staged, setStaged] = useState<StagedFile | null>(null);
  const [result, setResult] = useState<AnalyzeImageResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDragging = status === "dragging";
  const isAnalyzing = status === "analyzing";

  const stageFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMessage("Unsupported file type. Use PNG, JPG, WEBP, or GIF.");
      setStatus("error");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage("File is too large. Max size is 10MB.");
      setStatus("error");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setStaged({ file, previewUrl, sizeLabel: formatFileSize(file.size) });
    setResult(null);
    setErrorMessage(null);
    setStatus("selected");
  }, []);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (status !== "analyzing") setStatus("dragging");
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (status === "dragging") setStatus(staged ? "selected" : "idle");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) stageFile(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) stageFile(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  const handleRemove = () => {
    if (staged) URL.revokeObjectURL(staged.previewUrl);
    setStaged(null);
    setResult(null);
    setErrorMessage(null);
    setStatus("idle");
  };

  const handleAnalyze = async () => {
    if (!staged) return;
    setStatus("analyzing");
    setErrorMessage(null);
    try {
      const response = await analyzeImage(staged.file);
      setResult(response);
      setStatus("done");
    } catch (err) {
      setErrorMessage("Analysis failed. Check your connection and try again.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    if (staged) URL.revokeObjectURL(staged.previewUrl);
    setStaged(null);
    setResult(null);
    setErrorMessage(null);
    setStatus("idle");
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-[var(--radius-card)] border-2 border-dashed transition-all duration-300 ease-out overflow-hidden",
          isDragging
            ? "border-[var(--color-accent)] scale-[1.02] shadow-[var(--shadow-elevated)]"
            : "border-[var(--color-border-strong)]",
          !staged && !isDragging && "hover:border-[var(--color-muted-light)]",
          "bg-[var(--color-surface)]"
        )}
      >
        {/* Ambient blur wash when dragging */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 backdrop-blur-sm bg-[var(--color-accent-soft)]/40 pointer-events-none z-10"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        <div className="relative z-20 p-8 sm:p-10">
          {!staged ? (
            <EmptyDropzone
              isDragging={isDragging}
              onBrowseClick={() => inputRef.current?.click()}
            />
          ) : (
            <StagedPreview
              staged={staged}
              status={status}
              onRemove={handleRemove}
              onAnalyze={handleAnalyze}
            />
          )}

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleInputChange}
            className="sr-only"
            aria-label="Upload image file"
          />
        </div>
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="mt-3 text-sm text-red-600 text-center">
          {errorMessage}
        </p>
      )}

      <AnimatePresence mode="wait">
        {status === "done" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-6"
          >
            <ResultCard
              prediction={result.prediction}
              confidence={result.confidence}
              filename={staged?.file.name}
              onAnalyzeAnother={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyDropzone({
  isDragging,
  onBrowseClick,
}: {
  isDragging: boolean;
  onBrowseClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl mb-5 transition-transform duration-300",
          isDragging
            ? "bg-[var(--color-accent)] scale-110"
            : "bg-[var(--color-accent-soft)]"
        )}
      >
        <UploadCloud
          className={cn(
            "h-6 w-6 transition-colors",
            isDragging ? "text-white" : "text-[var(--color-accent)]"
          )}
          strokeWidth={1.75}
        />
      </div>

      <p className="text-base font-medium text-[var(--color-ink)] mb-1">
        {isDragging ? "Drop it here" : "Drag & drop an image"}
      </p>
      <p className="text-sm text-[var(--color-muted)] mb-6">
        PNG, JPG, WEBP, or GIF — up to 10MB
      </p>

      <button
        type="button"
        onClick={onBrowseClick}
        className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
      >
        Browse files
      </button>
    </div>
  );
}

function StagedPreview({
  staged,
  status,
  onRemove,
  onAnalyze,
}: {
  staged: StagedFile;
  status: UploadStatus;
  onRemove: () => void;
  onAnalyze: () => void;
}) {
  const isAnalyzing = status === "analyzing";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="relative h-40 w-40 rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={staged.previewUrl}
            alt={`Preview of ${staged.file.name}`}
            className="h-full w-full object-cover"
          />

          {isAnalyzing && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-[var(--color-ink)]/10" />
              <div
                className="absolute left-0 right-0 h-[3px] bg-[var(--color-accent)] animate-scan-sweep animate-scan-glow"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {!isAnalyzing && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-md transition-transform hover:scale-110"
            aria-label="Remove selected file"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-[var(--color-ink)] max-w-xs truncate">
          {staged.file.name}
        </p>
        <p className="text-xs text-[var(--color-muted)] font-mono mt-0.5">
          {staged.sizeLabel}
        </p>
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className={cn(
          "relative overflow-hidden flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all duration-200",
          isAnalyzing
            ? "bg-[var(--color-accent)]/70 cursor-not-allowed"
            : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] hover:scale-[1.03] active:scale-[0.98]"
        )}
      >
        {isAnalyzing ? (
          <>
            <ScanLine className="h-4 w-4 animate-pulse" strokeWidth={2} />
            Analyzing...
          </>
        ) : (
          "Analyze image"
        )}
      </button>
    </div>
  );
}
