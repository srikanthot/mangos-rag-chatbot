"use client";

export default function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        marginBottom: "var(--spacing-lg)",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div style={{ maxWidth: "80%" }}>
        {/* Avatar + label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
            marginBottom: "var(--spacing-xs)",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "var(--radius-sm)",
              background: "var(--color-accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect
                x="4"
                y="9"
                width="8"
                height="5"
                rx="1.5"
                fill="var(--color-accent)"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: "var(--font-size-xs)",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            AI Assistant
          </span>
        </div>

        <div
          style={{
            padding: "14px 18px",
            borderRadius: "var(--radius-xs) var(--radius-lg) var(--radius-lg) var(--radius-lg)",
            background: "var(--color-bg-message-assistant)",
            border: "1px solid var(--color-border-light)",
            display: "flex",
            gap: 5,
            alignItems: "center",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--color-text-muted)",
                animation: `typing 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
