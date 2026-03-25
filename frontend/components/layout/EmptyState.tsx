"use client";

import { APP_NAME } from "@/lib/constants";
import { STARTER_PROMPTS } from "@/lib/starter-prompts";

interface EmptyStateProps {
  onStarterPrompt: (prompt: string) => void;
}

export default function EmptyState({ onStarterPrompt }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "var(--spacing-2xl) var(--spacing-lg)",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        animation: "fadeIn 0.4s ease",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "var(--radius-xl)",
          background: "var(--color-accent-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "var(--spacing-lg)",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.477 2 2 6.015 2 10.95c0 2.73 1.34 5.17 3.45 6.78V22l3.76-2.06c.88.24 1.82.37 2.79.37 5.523 0 10-4.015 10-8.95S17.523 2 12 2z"
            fill="var(--color-accent)"
            opacity="0.15"
          />
          <path
            d="M12 2C6.477 2 2 6.015 2 10.95c0 2.73 1.34 5.17 3.45 6.78V22l3.76-2.06c.88.24 1.82.37 2.79.37 5.523 0 10-4.015 10-8.95S17.523 2 12 2z"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="11" r="1" fill="var(--color-accent)" />
          <circle cx="12" cy="11" r="1" fill="var(--color-accent)" />
          <circle cx="16" cy="11" r="1" fill="var(--color-accent)" />
        </svg>
      </div>

      <h1
        style={{
          fontSize: "var(--font-size-2xl)",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          marginBottom: "var(--spacing-sm)",
        }}
      >
        {APP_NAME}
      </h1>
      <p
        style={{
          fontSize: "var(--font-size-base)",
          color: "var(--color-text-secondary)",
          maxWidth: 520,
          lineHeight: 1.6,
          marginBottom: "var(--spacing-xl)",
        }}
      >
        Ask questions about technical manuals and documentation. Get accurate,
        citation-backed answers powered by AI.
      </p>

      {/* Suggestion cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "var(--spacing-md)",
          maxWidth: 560,
          width: "100%",
        }}
      >
        {STARTER_PROMPTS.map((item, i) => (
          <button
            key={i}
            onClick={() => onStarterPrompt(item.prompt)}
            style={{
              textAlign: "left",
              padding: "var(--spacing-md)",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-bg-suggestion)",
              border: "1px solid var(--color-border-light)",
              transition: "all var(--transition-fast)",
              animation: `slideUp 0.35s ease ${i * 0.06}s both`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "var(--color-bg-suggestion-hover)";
              e.currentTarget.style.borderColor = "var(--color-accent)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-bg-suggestion)";
              e.currentTarget.style.borderColor = "var(--color-border-light)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-primary)",
                marginBottom: "var(--spacing-xs)",
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-muted)",
                lineHeight: 1.4,
              }}
            >
              {item.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
