"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/history", label: "History" },
];

/**
 * Sticky glass navbar. Active link is underlined with the accent color.
 */
export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-[var(--color-border)]">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-80"
        >
          <LogoMark />
          <span className="text-[15px] tracking-tight">AI Content Analyzer</span>
        </Link>

        <ul className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200",
                    isActive
                      ? "text-[var(--color-ink)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute left-4 right-4 -bottom-[1px] h-[2px] rounded-full bg-[var(--color-accent)]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

/** Simple geometric mark — a scanning frame, echoing the detection concept. */
function LogoMark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="24" height="24" rx="7" fill="var(--color-ink)" />
      <path
        d="M8 9.5C8 8.67157 8.67157 8 9.5 8H10.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M18 9.5C18 8.67157 17.3284 8 16.5 8H15.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 16.5C8 17.3284 8.67157 18 9.5 18H10.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M18 16.5C18 17.3284 17.3284 18 16.5 18H15.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="7"
        y1="13"
        x2="19"
        y2="13"
        stroke="var(--color-accent-ring)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
