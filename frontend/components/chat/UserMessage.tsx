"use client";

import { formatMessageTime } from "@/lib/utils";
import type { Message } from "@/lib/types";

interface UserMessageProps {
  message: Message;
}

export default function UserMessage({ message }: UserMessageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        marginBottom: "var(--spacing-lg)",
      }}
    >
      <div
        style={{
          maxWidth: "72%",
          padding: "12px 16px",
          borderRadius: "var(--radius-lg) var(--radius-lg) var(--radius-xs) var(--radius-lg)",
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
      <div
        style={{
          fontSize: "var(--font-size-2xs)",
          color: "var(--color-text-muted)",
          marginTop: "var(--spacing-xs)",
          paddingRight: 2,
        }}
      >
        {formatMessageTime(message.created_at)}
      </div>
    </div>
  );
}
