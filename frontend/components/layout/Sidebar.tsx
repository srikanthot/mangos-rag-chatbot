"use client";

import Image from "next/image";
import StatusBadge from "@/components/common/StatusBadge";
import ConversationList from "@/components/conversations/ConversationList";
import NewChatButton from "@/components/conversations/NewChatButton";
import ThemeToggle from "@/components/common/ThemeToggle";
import { APP_VERSION, FEEDBACK_URL } from "@/lib/constants";
import type { Conversation, ThemeMode } from "@/lib/types";

interface SidebarProps {
  open: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  loading: boolean;
  backendOnline: boolean;
}

export default function Sidebar({
  open,
  theme,
  onToggleTheme,
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  loading,
  backendOnline,
}: SidebarProps) {
  return (
    <aside
      style={{
        width: open ? "var(--sidebar-width)" : 0,
        height: "100vh",
        background: "var(--color-bg-sidebar)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
        transition: "width var(--transition-slow)",
        borderRight: open ? "1px solid var(--color-border-sidebar)" : "none",
      }}
    >
      {/* Logo + Version */}
      <div
        style={{
          padding: "20px 20px 8px",
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-md)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-md)",
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <Image
            src="/pseg-logo.png"
            alt="PSEG"
            width={24}
            height={24}
            style={{ objectFit: "contain" }}
          />
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "var(--font-size-base)",
              color: "var(--color-text-sidebar-bright)",
              lineHeight: 1.2,
            }}
          >
            PSEG Chatbot
          </div>
          <div
            style={{
              fontSize: "var(--font-size-2xs)",
              color: "var(--color-text-sidebar-muted)",
              marginTop: 2,
            }}
          >
            {APP_VERSION}
          </div>
        </div>
      </div>

      {/* Status */}
      <div style={{ padding: "8px 20px 16px" }}>
        <StatusBadge
          status={backendOnline ? "online" : "offline"}
          label={backendOnline ? "Connected" : "Disconnected"}
        />
      </div>

      {/* New Chat Button */}
      <div style={{ padding: "0 14px 12px" }}>
        <NewChatButton onClick={onNewChat} />
      </div>

      {/* Conversations */}
      <div
        style={{
          padding: "0 8px",
          marginBottom: "var(--spacing-sm)",
        }}
      >
        <div
          style={{
            fontSize: "var(--font-size-2xs)",
            fontWeight: 600,
            color: "var(--color-text-sidebar-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            padding: "0 12px 6px",
          }}
        >
          Recent Chats
        </div>
      </div>
      <div
        className="sidebar-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 8px",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "var(--spacing-lg) var(--spacing-md)",
              textAlign: "center",
              fontSize: "var(--font-size-xs)",
              color: "var(--color-text-sidebar-muted)",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            Loading conversations...
          </div>
        ) : (
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={onSelectConversation}
            onDelete={onDeleteConversation}
            onRename={onRenameConversation}
          />
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 14px",
          borderTop: "1px solid var(--color-border-sidebar)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-sm)",
          flexShrink: 0,
        }}
      >
        <a
          href={FEEDBACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
            padding: "8px 12px",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text-sidebar)",
            fontSize: "var(--font-size-sm)",
            textDecoration: "none",
            transition: "background var(--transition-fast)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--color-bg-sidebar-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1C4.136 1 1 3.91 1 7.5c0 1.95.97 3.68 2.5 4.82V15l2.63-1.44c.58.16 1.2.24 1.87.24 3.864 0 7-2.91 7-6.5S11.864 1 8 1z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          Share Feedback
        </a>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </aside>
  );
}
