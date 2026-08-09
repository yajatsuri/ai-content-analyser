import Link from "next/link";

/**
 * Minimal footer — one line, no clutter. This product doesn't need a
 * sitemap-style footer; it needs to get out of the way.
 */
export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-[var(--color-muted)]">
          AI Content Analyzer — built for detecting AI-generated images.
        </p>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
          >
            Home
          </Link>
          <Link
            href="/history"
            className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
          >
            History
          </Link>
        </div>
      </div>
    </footer>
  );
}
