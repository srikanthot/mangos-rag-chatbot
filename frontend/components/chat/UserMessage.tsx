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
        borderLeft: "3px solid var(--color-accent)",
        paddingLeft: "var(--spacing-md)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Avatar + label row */}
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
              width: 28,
              height: 28,
              borderRadius: "var(--radius-full)",
              background: "var(--color-accent)",
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

        {/* Message bubble */}
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-bg-message-user)",
            color: "var(--color-text-inverse)",
            fontSize: "var(--font-size-base)",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
