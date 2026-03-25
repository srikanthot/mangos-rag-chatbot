"use client";

import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import type { Conversation, Message } from "@/lib/types";

interface ChatShellProps {
  conversation: Conversation;
  messages: Message[];
  isStreaming: boolean;
  loadingMessages: boolean;
  onSend: (content: string) => void;
  onFeedback: (messageId: string, rating: "up" | "down") => void;
}

export default function ChatShell({
  conversation,
  messages,
  isStreaming,
  loadingMessages,
  onSend,
  onFeedback,
}: ChatShellProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

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
          padding: "var(--spacing-lg) var(--spacing-lg) var(--spacing-md)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--chat-max-width)",
            margin: "0 auto",
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
          ) : (
            messages.map((msg, i) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                index={i}
                onFeedback={onFeedback}
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
