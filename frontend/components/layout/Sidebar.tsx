"use client";

import StatusBadge from "@/components/common/StatusBadge";
import ConversationList from "@/components/conversations/ConversationList";
import NewChatButton from "@/components/conversations/NewChatButton";
import ThemeToggle from "@/components/common/ThemeToggle";
import { APP_VERSION, APP_SUBTITLE, FEEDBACK_URL } from "@/lib/constants";
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
  onRefreshConversations: () => void;
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
  onRefreshConversations,
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
        {/* PSEG sunburst logo */}
        <img
          src="/pseg-logo.svg"
          alt="PSEG"
          width={140}
          height={35}
          style={{ objectFit: "contain", flexShrink: 0 }}
        />
      </div>
      <div
        style={{
          padding: "0 20px 12px",
          fontSize: "var(--font-size-xs)",
          color: "var(--color-text-sidebar-muted)",
          lineHeight: 1.3,
        }}
      >
        {APP_SUBTITLE} &middot; {APP_VERSION}
      </div>

      {/* Status */}
      <div style={{ padding: "0 20px 16px" }}>
        <StatusBadge
          status={backendOnline ? "online" : "offline"}
          label={backendOnline ? "Connected" : "Disconnected"}
        />
      </div>

      {/* New Chat Button */}
      <div style={{ padding: "0 14px 12px" }}>
        <NewChatButton onClick={onNewChat} />
      </div>

      {/* Recent header with count + refresh */}
      <div
        style={{
          padding: "0 14px",
          marginBottom: "var(--spacing-xs)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: "var(--font-size-2xs)",
            fontWeight: 600,
            color: "var(--color-text-sidebar-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            padding: "0 6px",
          }}
        >
          Recent{conversations.length > 0 ? ` (${conversations.length})` : ""}
        </div>
        <button
          onClick={onRefreshConversations}
          aria-label="Refresh conversations"
          title="Refresh"
          style={{
            width: 26,
            height: 26,
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-text-sidebar-muted)",
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-bg-sidebar-hover)";
            e.currentTarget.style.color = "var(--color-text-sidebar-bright)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--color-text-sidebar-muted)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M14 8A6 6 0 1 1 8 2a5.93 5.93 0 0 1 4.24 1.76"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2v4h-4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Conversations */}
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
            justifyContent: "center",
            gap: "var(--spacing-sm)",
            padding: "10px 16px",
            borderRadius: "var(--radius-md)",
            background: "var(--color-accent-orange)",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "var(--font-size-sm)",
            textDecoration: "none",
            transition: "background var(--transition-fast)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "var(--color-accent-orange-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--color-accent-orange)")
          }
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M13 1H5a1 1 0 0 0-1 1v1H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M6 6h4M6 8.5h4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          Share Feedback
        </a>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </aside>
  );
}
