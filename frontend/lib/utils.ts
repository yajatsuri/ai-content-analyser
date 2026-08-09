/**
 * Formatting helpers — pure functions, no side effects, no API calls.
 */

/**
 * Converts a byte count into a human-readable size string.
 * e.g. 1536 -> "1.5 KB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, exponent);
  const formatted = exponent === 0 ? value.toString() : value.toFixed(1);

  return `${formatted} ${units[exponent]}`;
}

/**
 * Converts a 0..1 confidence score into a percentage string.
 * e.g. 0.984 -> "98.4%"
 */
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

/**
 * Converts a 0..1 confidence score into a whole-number percentage for
 * progress bar widths etc.
 * e.g. 0.984 -> 98
 */
export function confidenceToPercent(confidence: number): number {
  return Math.round(confidence * 100);
}

/**
 * Formats an ISO date string into a readable date + time.
 * e.g. "2026-08-04T10:15:00Z" -> "Aug 4, 2026 · 3:45 PM"
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} · ${timePart}`;
}

/**
 * Returns just the relative-ish short date, used on compact cards.
 * e.g. "2026-08-04T10:15:00Z" -> "Aug 4, 2026"
 */
export function formatDateShort(isoString: string): string {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncates a filename in the middle if it's too long, preserving
 * the extension — better than end-truncation for filenames.
 * e.g. "screenshot_2026_very_long_name.png" -> "screenshot_2026_ve....png"
 */
export function truncateFilename(filename: string, maxLength = 28): string {
  if (filename.length <= maxLength) return filename;

  const lastDot = filename.lastIndexOf(".");
  const hasExtension = lastDot > 0 && lastDot < filename.length - 1;

  const extension = hasExtension ? filename.slice(lastDot) : "";
  const nameWithoutExt = hasExtension ? filename.slice(0, lastDot) : filename;

  const keep = maxLength - extension.length - 3; // 3 for "..."
  if (keep <= 0) return filename.slice(0, maxLength);

  return `${nameWithoutExt.slice(0, keep)}...${extension}`;
}

/**
 * Merges class name strings, filtering out falsy values.
 * Lightweight alternative to `clsx` for this project's needs.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
