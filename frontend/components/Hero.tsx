import { UploadCard } from "@/components/UploadCard";

/**
 * Hero section.
 * The dropzone IS the hero — no big-number stat block, no filler
 * illustration. For a detection tool, the fastest way to earn trust
 * is to let the person drop an image in and watch it get scanned.
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-muted)] mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
          Pixel-level image forensics
        </span>

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--color-ink)] text-balance">
          Know if an image is real —
          <br className="hidden sm:block" />
          before you trust it.
        </h1>

        <p className="mt-5 text-lg text-[var(--color-muted)] max-w-xl mx-auto text-balance">
          Drop in an image and get an AI-generated or real verdict, backed by
          a confidence score, in seconds.
        </p>
      </div>

      <UploadCard />
    </section>
  );
}
