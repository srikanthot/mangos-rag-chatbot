"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { MAX_MESSAGE_LENGTH } from "@/lib/constants";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;
  const charCount = value.length;
  const showCharCount = charCount > MAX_MESSAGE_LENGTH * 0.8;

  return (
    <div
      style={{
        padding: "12px var(--spacing-lg) 16px",
        background: "var(--color-bg-primary)",
        borderTop: "1px solid var(--color-border-light)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          maxWidth: "var(--chat-max-width)",
          margin: "0 auto",
        }}
      >
        <div
          className="chat-input-container"
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "var(--spacing-sm)",
            background: "var(--color-bg-input)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            padding: "8px 8px 8px 18px",
            boxShadow: "var(--shadow-sm)",
            transition:
              "border-color var(--transition-fast), box-shadow var(--transition-fast)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder={
              disabled
                ? "Waiting for response..."
                : "Ask a question about the PSEG Tech Manual..."
            }
            disabled={disabled}
            rows={1}
            aria-label="Message input"
            style={{
              flex: 1,
              resize: "none",
              background: "transparent",
              fontSize: "var(--font-size-base)",
              lineHeight: 1.5,
              minHeight: 24,
              maxHeight: 140,
              padding: "4px 0",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!canSend}
            aria-label="Send message"
            style={{
              width: 38,
              height: 38,
              borderRadius: "var(--radius-lg)",
              background: canSend
                ? "var(--color-accent-orange)"
                : "var(--color-bg-hover)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all var(--transition-fast)",
              flexShrink: 0,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              style={{
                color: canSend
                  ? "#ffffff"
                  : "var(--color-text-muted)",
                transition: "color var(--transition-fast)",
              }}
            >
              <path
                d="M9 15V3m0 0l-5 5m5-5l5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="rotate(90 9 9)"
              />
            </svg>
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "var(--spacing-sm)",
            padding: "0 4px",
          }}
        >
          <div
            style={{
              fontSize: "var(--font-size-2xs)",
              color: "var(--color-text-muted)",
              flex: 1,
              textAlign: "center",
            }}
          >
            Shift+Enter for new line &middot; Responses are AI-generated &mdash; always verify critical information.
          </div>
          {showCharCount && (
            <div
              style={{
                fontSize: "var(--font-size-2xs)",
                color:
                  charCount >= MAX_MESSAGE_LENGTH
                    ? "var(--color-danger)"
                    : "var(--color-text-muted)",
                fontWeight: charCount >= MAX_MESSAGE_LENGTH ? 600 : 400,
                flexShrink: 0,
                marginLeft: "var(--spacing-sm)",
              }}
            >
              {charCount}/{MAX_MESSAGE_LENGTH}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
