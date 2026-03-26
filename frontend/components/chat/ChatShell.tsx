"use client";

import { useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { STARTER_PROMPTS } from "@/lib/starter-prompts";
import type { Conversation, Message } from "@/lib/types";

interface ChatShellProps {
  conversation: Conversation;
  messages: Message[];
  isStreaming: boolean;
  loadingMessages: boolean;
  onSend: (content: string) => void;
  onFeedback: (messageId: string, rating: "up" | "down", comment?: string) => void;
  onStarterPrompt?: (prompt: string) => void;
  onRetry?: (lastUserContent: string) => void;
  onRefreshMessages?: () => void;
}

export default function ChatShell({
  conversation,
  messages,
  isStreaming,
  loadingMessages,
  onSend,
  onFeedback,
  onStarterPrompt,
  onRetry,
  onRefreshMessages,
}: ChatShellProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Refresh messages when tab regains focus (handles tab-switch during streaming)
  useEffect(() => {
    if (!onRefreshMessages) return;
    const handleFocus = () => {
      // Only refresh if not currently streaming
      if (!isStreaming) {
        onRefreshMessages();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [onRefreshMessages, isStreaming]);

  const isEmpty = !loadingMessages && messages.length === 0;

  // Find the last assistant message index for retry button placement
  const lastAssistantIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return i;
    }
    return -1;
  })();

  // Find the last user message content for retry
  const lastUserContent = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") return messages[i].content;
    }
    return "";
  })();

  const handleRetry = useCallback(() => {
    if (onRetry && lastUserContent) {
      onRetry(lastUserContent);
    }
  }, [onRetry, lastUserContent]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Spacer that shrinks — pushes messages toward bottom for short chats */}
        <div style={{ flex: 1, minHeight: 0 }} />

        <div
          style={{
            maxWidth: "var(--chat-max-width)",
            margin: "0 auto",
            width: "100%",
            padding: "var(--spacing-lg) var(--spacing-lg) var(--spacing-md)",
          }}
        >
          {loadingMessages ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--spacing-2xl)",
                color: "var(--color-text-muted)",
                fontSize: "var(--font-size-sm)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            >
              Loading messages...
            </div>
          ) : isEmpty ? (
            /* Empty active conversation — lightweight inline suggestions */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "var(--spacing-xl) 0 var(--spacing-md)",
                animation: "fadeIn 0.4s ease",
              }}
            >
              <div
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-muted)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                How can I help you today?
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  maxWidth: 440,
                  width: "100%",
                }}
              >
                {STARTER_PROMPTS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      onStarterPrompt
                        ? onStarterPrompt(item.prompt)
                        : onSend(item.prompt)
                    }
                    style={{
                      textAlign: "left",
                      padding: "9px 14px",
                      borderRadius: 8,
                      background: "var(--color-bg-secondary)",
                      border: "1px solid var(--color-border)",
                      fontSize: "var(--font-size-xs)",
                      color: "var(--color-text-primary)",
                      transition: "all 150ms ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "var(--color-bg-suggestion-hover)";
                      e.currentTarget.style.borderColor = "var(--color-accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "var(--color-bg-secondary)";
                      e.currentTarget.style.borderColor = "var(--color-border)";
                    }}
                  >
                    {item.prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                index={i}
                onFeedback={onFeedback}
                onRetry={handleRetry}
                isLatestAssistant={i === lastAssistantIdx && !isStreaming}
              />
            ))
          )}
          {isStreaming &&
            messages.length > 0 &&
            messages[messages.length - 1].status !== "partial" && (
              <TypingIndicator />
            )}
          <div ref={bottomRef} />
        </div>
      </div>
      <ChatInput onSend={onSend} disabled={isStreaming} />
    </div>
  );
}
