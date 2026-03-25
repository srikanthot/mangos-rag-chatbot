"use client";

import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";

interface HeaderProps {
  conversationTitle: string | null;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenInfo: () => void;
}

export default function Header({
  conversationTitle,
  sidebarOpen,
  onToggleSidebar,
  onOpenInfo,
}: HeaderProps) {
  return (
    <header
      style={{
        height: "var(--header-height)",
        background: "var(--color-bg-secondary)",
        borderBottom: "1px solid var(--color-border-light)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--spacing-lg)",
        flexShrink: 0,
        boxShadow: "var(--shadow-xs)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-md)",
          minWidth: 0,
        }}
      >
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background var(--transition-fast)",
            flexShrink: 0,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--color-bg-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: "var(--font-size-base)",
              color: "var(--color-text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {conversationTitle ?? APP_NAME}
          </div>
          <div
            style={{
              fontSize: "var(--font-size-2xs)",
              color: "var(--color-text-muted)",
              marginTop: -1,
            }}
          >
            {APP_SUBTITLE}
          </div>
        </div>
      </div>

      <button
        onClick={onOpenInfo}
        aria-label="Info & help"
        title="Info & help"
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--radius-full)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background var(--transition-fast)",
          flexShrink: 0,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--color-bg-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "transparent")
        }
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle
            cx="10"
            cy="10"
            r="8"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 7.5a2 2 0 0 1 3.94.5c0 1-1.44 1.5-1.44 1.5M10 13.5v.01"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </header>
  );
}
