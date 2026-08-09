/**
 * Shared TypeScript types.
 * These mirror the existing backend API contracts EXACTLY — do not rename
 * or restructure fields, the Spring Boot / FastAPI responses are unchanged.
 */

/** Prediction label returned by the ML service. */
export type PredictionLabel = "AI" | "REAL";

/**
 * Response shape from:
 * POST /api/v1/analyses/image
 */
export interface AnalyzeImageResponse {
  prediction: PredictionLabel;
  confidence: number; // 0..1
}

/**
 * A single record from:
 * GET /api/v1/analyses/image
 */
export interface AnalysisRecord {
  id: number;
  filename: string;
  imageUrl: string;
  prediction: PredictionLabel;
  confidence: number; // 0..1
  createdAt: string; // ISO date string
}

/** Full history response is an array of records. */
export type AnalysisHistoryResponse = AnalysisRecord[];

/* ---------------- Frontend-only UI state types ---------------- */

/** Lifecycle of the upload + analyze flow on the landing page. */
export type UploadStatus = "idle" | "dragging" | "selected" | "analyzing" | "done" | "error";

/** A file staged for upload, with local preview info. */
export interface StagedFile {
  file: File;
  previewUrl: string;
  sizeLabel: string;
}

/** Filter options for the History page. */
export type PredictionFilter = "ALL" | "AI" | "REAL";
export type SortOrder = "NEWEST" | "OLDEST";

export interface HistoryFilters {
  query: string;
  prediction: PredictionFilter;
  sort: SortOrder;
}
