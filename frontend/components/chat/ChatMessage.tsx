"use client";

import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import type { Message } from "@/lib/types";

interface ChatMessageProps {
  message: Message;
  index: number;
  onFeedback: (messageId: string, rating: "up" | "down", comment?: string) => void;
  onRetry?: () => void;
  isLatestAssistant?: boolean;
}

export default function ChatMessage({
  message,
  index,
  onFeedback,
  onRetry,
  isLatestAssistant,
}: ChatMessageProps) {
  return (
    <div style={{ animation: `fadeIn 0.3s ease ${Math.min(index * 0.05, 0.3)}s both` }}>
      {message.role === "user" ? (
        <UserMessage message={message} />
      ) : (
        <AssistantMessage
          message={message}
          onFeedback={onFeedback}
          onRetry={onRetry}
          isLatest={isLatestAssistant}
        />
      )}
    </div>
  );
}
