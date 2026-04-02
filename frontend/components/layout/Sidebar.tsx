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
  const isDark = theme === "dark";

  return (
    <div
      className={`sidebar-mobile${!open ? " sidebar-mobile-hidden" : ""}`}
      style={{
        width: open ? "var(--sidebar-width)" : 0,
        flexShrink: 0,
        transition: "width var(--transition-slow), transform var(--transition-slow)",
        position: "relative",
        height: "100vh",
        padding: open ? "8px 0 8px 8px" : 0,
      }}
    >
      <aside
        style={{
          width: "100%",
          height: "100%",
          background: "var(--color-bg-sidebar)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 14,
          border: "1px solid var(--color-border-sidebar)",
          boxShadow: "var(--shadow-sm)",
          opacity: open ? 1 : 0,
          transition: "opacity var(--transition-normal)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "16px 16px 6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <img
            src={isDark ? "/mangos-logo-dark.svg" : "/mangos-logo.svg"}
            alt="MANGOS"
            width={150}
            height={38}
            style={{ objectFit: "contain", flexShrink: 0 }}
          />
        </div>

        {/* Subtitle + version */}
        <div
          style={{
            padding: "0 16px 10px",
            fontSize: "var(--font-size-2xs)",
            color: "var(--color-text-sidebar-muted)",
            lineHeight: 1.4,
            textAlign: "center",
          }}
        >
          {APP_SUBTITLE} &middot; {APP_VERSION}
        </div>

        {/* Status */}
        <div style={{ padding: "0 14px 10px" }}>
          <StatusBadge
            status={backendOnline ? "online" : "offline"}
            label={backendOnline ? "Connected" : "Disconnected"}
          />
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            height: 1,
            background: "var(--color-border-sidebar)",
            margin: "0 14px 10px",
            flexShrink: 0,
          }}
        />

        {/* New Chat Button */}
        <div style={{ padding: "0 14px 12px" }}>
          <NewChatButton onClick={onNewChat} />
        </div>

        {/* Conversations header with refresh */}
        <div
          style={{
            padding: "0 14px",
            marginBottom: 4,
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
              padding: "0 4px",
            }}
          >
            Conversations
          </div>
          <button
            onClick={onRefreshConversations}
            aria-label="Refresh conversations"
            title="Refresh"
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-sidebar-muted)",
              transition: "all 150ms ease",
              border: "none",
              background: "none",
              cursor: "pointer",
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
            <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "8px 6px" }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ padding: "8px 10px", borderRadius: "var(--radius-md)" }}>
                  <div className="skeleton" style={{ width: i % 2 === 0 ? "70%" : "85%", height: 14, marginBottom: 6 }} />
                  <div className="skeleton" style={{ width: 50, height: 10 }} />
                </div>
              ))}
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

        {/* ── Divider before footer ── */}
        <div
          style={{
            height: 1,
            background: "var(--color-border-sidebar)",
            margin: "0 14px",
            flexShrink: 0,
          }}
        />

        {/* Footer */}
        <div
          style={{
            padding: "10px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flexShrink: 0,
          }}
        >
          {/* Feedback button */}
          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "8px 0",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "var(--color-accent-orange)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "var(--font-size-sm)",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 150ms ease",
              boxShadow: "0 2px 8px rgba(242, 101, 34, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-accent-orange-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-accent-orange)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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
    </div>
  );
}
