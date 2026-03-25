"use client";

import type { ThemeMode } from "@/lib/types";

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-sm)",
        padding: "8px 12px",
        borderRadius: "var(--radius-md)",
        color: "var(--color-text-sidebar)",
        fontSize: "var(--font-size-sm)",
        transition: "background var(--transition-fast)",
        width: "100%",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--color-bg-sidebar-hover)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "transparent")
      }
    >
      {theme === "light" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M13.36 10.06A6 6 0 0 1 5.94 2.64 6 6 0 1 0 13.36 10.06z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
}
