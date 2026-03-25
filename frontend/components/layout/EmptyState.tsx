"use client";

import { STARTER_PROMPTS } from "@/lib/starter-prompts";

interface EmptyStateProps {
  onStarterPrompt: (prompt: string) => void;
  onNewChat: () => void;
}

export default function EmptyState({ onStarterPrompt, onNewChat }: EmptyStateProps) {
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
      {/* Chat bubble icon */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "var(--radius-xl)",
          background: "linear-gradient(135deg, #e8e0f0 0%, #d4c8e8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "var(--spacing-lg)",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.477 2 2 6.015 2 10.95c0 2.73 1.34 5.17 3.45 6.78V22l3.76-2.06c.88.24 1.82.37 2.79.37 5.523 0 10-4.015 10-8.95S17.523 2 12 2z"
            fill="#9b8ab8"
            opacity="0.3"
          />
          <path
            d="M12 2C6.477 2 2 6.015 2 10.95c0 2.73 1.34 5.17 3.45 6.78V22l3.76-2.06c.88.24 1.82.37 2.79.37 5.523 0 10-4.015 10-8.95S17.523 2 12 2z"
            stroke="#8b7aab"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
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
        Start a conversation
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
        Ask questions about PSEG technical manuals. Answers are grounded in
        retrieved documents with verifiable source citations.
      </p>

      {/* New Chat button */}
      <button
        onClick={onNewChat}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--spacing-sm)",
          padding: "12px 28px",
          borderRadius: "var(--radius-md)",
          background: "var(--color-text-primary)",
          color: "var(--color-text-inverse)",
          fontWeight: 600,
          fontSize: "var(--font-size-base)",
          marginBottom: "var(--spacing-xl)",
          transition: "opacity var(--transition-fast)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 3v10M3 8h10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        New Chat
      </button>

      {/* TRY ASKING label */}
      <div
        style={{
          fontSize: "var(--font-size-2xs)",
          fontWeight: 600,
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "var(--spacing-md)",
        }}
      >
        Try Asking
      </div>

      {/* Starter prompts — single column, full width */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-sm)",
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
              padding: "14px var(--spacing-md)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-primary)",
              transition: "all var(--transition-fast)",
              animation: `slideUp 0.35s ease ${i * 0.06}s both`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-bg-suggestion)";
              e.currentTarget.style.borderColor = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          >
            {item.prompt}
          </button>
        ))}
      </div>

      {/* Footer text */}
      <p
        style={{
          fontSize: "var(--font-size-xs)",
          color: "var(--color-text-muted)",
          marginTop: "var(--spacing-xl)",
        }}
      >
        Previous conversations are saved and available in the sidebar.
      </p>
    </div>
  );
}
