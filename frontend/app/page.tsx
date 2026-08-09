"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/components/Hero";
import { isLoggedIn } from "@/lib/auth";

/**
 * Landing page.
 * Navbar/Footer live in app/layout.tsx and wrap every route, so this
 * file's only job is the hero + upload experience. All upload, preview,
 * analyze, and result-display logic lives inside UploadCard/ResultCard —
 * this page stays a thin composition layer on purpose.
 *
 * Gated behind auth: unauthenticated visitors are redirected to /login
 * before the upload UI ever renders, since analyze/history calls require
 * a JWT and previously failed silently otherwise.
 */
export default function HomePage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) return null;

  return (
    <main className="min-h-screen">
      <Hero />
    </main>
  );
}
