import { Hero } from "@/components/Hero";

/**
 * Landing page.
 * Navbar/Footer live in app/layout.tsx and wrap every route, so this
 * file's only job is the hero + upload experience. All upload, preview,
 * analyze, and result-display logic lives inside UploadCard/ResultCard —
 * this page stays a thin composition layer on purpose.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
    </main>
  );
}
