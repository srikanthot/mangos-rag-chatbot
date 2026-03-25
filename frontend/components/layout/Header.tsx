"use client";

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
  const inChat = !!conversationTitle;

  return (
    <header
      style={{
        height: "var(--header-height)",
        background: inChat ? "var(--color-bg-header-active)" : "var(--color-bg-secondary)",
        borderBottom: inChat ? "none" : "1px solid var(--color-border-light)",
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
            color: inChat ? "#ffffff" : "inherit",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = inChat
              ? "rgba(255,255,255,0.1)"
              : "var(--color-bg-hover)")
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

        {inChat ? (
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {/* Lightning bolt icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M9 1L3 9h4l-1 6 6-8H8l1-6z"
                  fill="#f59e0b"
                  stroke="#f59e0b"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "var(--font-size-base)",
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {conversationTitle}
              </span>
            </div>
            <div
              style={{
                fontSize: "var(--font-size-2xs)",
                color: "rgba(255,255,255,0.65)",
                marginTop: -1,
              }}
            >
              Answers are grounded in retrieved manual content with source citations.
            </div>
          </div>
        ) : null}
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
          color: inChat ? "#ffffff" : "inherit",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = inChat
            ? "rgba(255,255,255,0.1)"
            : "var(--color-bg-hover)")
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
            d="M10 9v4M10 7v.01"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </header>
  );
}
