"use client";

import type { Message } from "@/lib/types";

interface UserMessageProps {
  message: Message;
}

export default function UserMessage({ message }: UserMessageProps) {
  return (
    <div
      style={{
        display: "flex",
        marginBottom: "var(--spacing-lg)",
        paddingLeft: 0,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Avatar + label row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--radius-full)",
              background: "var(--color-accent-user)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "#ffffff",
              fontSize: "var(--font-size-xs)",
              fontWeight: 700,
            }}
          >
            U
          </div>
          <span
            style={{
              fontSize: "var(--font-size-xs)",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            You
          </span>
        </div>

        {/* Message bubble — light blue gradient matching reference app */}
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderRadius: 12,
            background: "var(--color-bg-message-user)",
            border: "1px solid var(--color-border-message-user)",
            borderLeft: "4px solid var(--color-accent-user)",
            color: "var(--color-text-primary)",
            fontSize: "var(--font-size-sm)",
            lineHeight: 1.625,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
