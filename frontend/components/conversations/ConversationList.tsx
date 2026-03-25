"use client";

import ConversationItem from "./ConversationItem";
import type { Conversation } from "@/lib/types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (conversation: Conversation) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onRename,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div
        style={{
          padding: "var(--spacing-lg) var(--spacing-md)",
          textAlign: "center",
          fontSize: "var(--font-size-xs)",
          color: "var(--color-text-sidebar-muted)",
        }}
      >
        No conversations yet
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.thread_id}
          conversation={conv}
          isActive={conv.thread_id === activeId}
          onSelect={() => onSelect(conv)}
          onDelete={() => onDelete(conv.thread_id)}
          onRename={(title) => onRename(conv.thread_id, title)}
        />
      ))}
    </div>
  );
}
