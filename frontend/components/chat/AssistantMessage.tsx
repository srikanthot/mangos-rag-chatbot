"use client";

import { useState, useCallback } from "react";
import CitationPanel from "./CitationPanel";
import type { Message } from "@/lib/types";

interface AssistantMessageProps {
  message: Message;
  onFeedback: (messageId: string, rating: "up" | "down") => void;
}

export default function AssistantMessage({
  message,
  onFeedback,
}: AssistantMessageProps) {
  const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

  const isStreaming = message.status === "partial";
  const isError = message.status === "error";

  const handleFeedback = useCallback(
    (rating: "up" | "down") => {
      if (feedbackGiven || submitting) return;
      setSubmitting(true);
      setFeedbackGiven(rating);
      onFeedback(message.id, rating);
      setTimeout(() => setSubmitting(false), 1000);
    },
    [feedbackGiven, submitting, message.id, onFeedback]
  );

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
            A
          </div>
          <span
            style={{
              fontSize: "var(--font-size-xs)",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            Assistant
          </span>
          {isStreaming && (
            <span
              style={{
                fontSize: "var(--font-size-2xs)",
                color: "var(--color-text-muted)",
                animation: "pulse 1.2s ease-in-out infinite",
              }}
            >
              Generating...
            </span>
          )}
        </div>

        {/* Response card */}
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "var(--radius-lg)",
            background: isError
              ? "var(--color-accent-light)"
              : "var(--color-bg-message-assistant)",
            border: `1px solid ${
              isError ? "var(--color-danger)" : "var(--color-border-light)"
            }`,
            fontSize: "var(--font-size-base)",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            boxShadow: "var(--shadow-xs)",
            color: isError
              ? "var(--color-danger)"
              : "var(--color-text-primary)",
          }}
        >
          {message.content || (isStreaming ? "\u00A0" : "")}
          {isStreaming && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "1em",
                background: "var(--color-accent)",
                marginLeft: 2,
                animation: "pulse 0.8s ease-in-out infinite",
                verticalAlign: "text-bottom",
              }}
            />
          )}
        </div>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && !isStreaming && (
          <CitationPanel citations={message.citations} />
        )}

        {/* Feedback row */}
        {message.status === "complete" && !isError && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
              marginTop: "var(--spacing-sm)",
              paddingLeft: 2,
            }}
          >
            <span
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-muted)",
              }}
            >
              Helpful?
            </span>
            <FeedbackButton
              type="up"
              active={feedbackGiven === "up"}
              disabled={feedbackGiven !== null}
              onClick={() => handleFeedback("up")}
            />
            <FeedbackButton
              type="down"
              active={feedbackGiven === "down"}
              disabled={feedbackGiven !== null}
              onClick={() => handleFeedback("down")}
            />
            {feedbackGiven && (
              <span
                style={{
                  fontSize: "var(--font-size-2xs)",
                  color: "var(--color-text-muted)",
                  marginLeft: 4,
                  animation: "fadeIn 0.3s ease",
                }}
              >
                Thanks!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackButton({
  type,
  active,
  disabled,
  onClick,
}: {
  type: "up" | "down";
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={type === "up" ? "Thumbs up" : "Thumbs down"}
      title={type === "up" ? "Helpful" : "Not helpful"}
      style={{
        width: 26,
        height: 26,
        borderRadius: "var(--radius-xs)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active
          ? "var(--color-accent-orange)"
          : "var(--color-text-muted)",
        opacity: disabled && !active ? 0.4 : 1,
        transition: "all var(--transition-fast)",
      }}
    >
      {type === "up" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4.5 7V14H2.5C1.95 14 1.5 13.55 1.5 13V8C1.5 7.45 1.95 7 2.5 7H4.5ZM6 7L8.5 1.5C9.33 1.5 10 2.17 10 3V5.5H13.17C13.98 5.5 14.58 6.24 14.42 7.03L13.17 13.03C13.06 13.59 12.56 14 12 14H6V7Z"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
            fill={active ? "currentColor" : "none"}
          />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ transform: "rotate(180deg)" }}
        >
          <path
            d="M4.5 7V14H2.5C1.95 14 1.5 13.55 1.5 13V8C1.5 7.45 1.95 7 2.5 7H4.5ZM6 7L8.5 1.5C9.33 1.5 10 2.17 10 3V5.5H13.17C13.98 5.5 14.58 6.24 14.42 7.03L13.17 13.03C13.06 13.59 12.56 14 12 14H6V7Z"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
            fill={active ? "currentColor" : "none"}
          />
        </svg>
      )}
    </button>
  );
}
