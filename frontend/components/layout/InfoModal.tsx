"use client";

import { useState, useEffect, useRef } from "react";
import { APP_VERSION, APP_SUBTITLE, FEEDBACK_URL } from "@/lib/constants";

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

type TabId = "usage" | "features" | "whats-new";

const TABS: { id: TabId; label: string }[] = [
  { id: "usage", label: "How to Use" },
  { id: "features", label: "Features" },
  { id: "whats-new", label: "What's New" },
];

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="6" stroke="#d97706" strokeWidth="1.5" />
        <path d="M13.5 13.5L17 17" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    bgColor: "#fef3c7",
    title: "Document Search",
    description:
      "Searches across indexed PSEG technical manuals using hybrid vector + keyword retrieval.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M5 2h7l4 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
          stroke="#ea580c"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M7 10h6M7 13h4" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    bgColor: "#ffedd5",
    title: "Source Citations",
    description:
      "Every answer includes clickable PDF citations showing the exact document, section, and page.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2C5.58 2 2 5.36 2 9.5c0 2.3 1.12 4.35 2.88 5.7V18l3.14-1.72c.62.2 1.28.32 1.98.32 4.42 0 8-3.36 8-7.5S14.42 2 10 2z"
          stroke="#9333ea"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    bgColor: "#f3e8ff",
    title: "Conversation History",
    description:
      "All chat sessions are persisted and can be resumed at any time from the sidebar.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 10a7 7 0 0 1 13.15-3.36M17 10a7 7 0 0 1-13.15 3.36"
          stroke="#2563eb"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M16.15 3v3.64h-3.64" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.85 17v-3.64h3.64" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bgColor: "#dbeafe",
    title: "Follow-up Context",
    description:
      "Ask follow-up questions \u2014 the assistant remembers the conversation context.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M6 9V16H4a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h2zM8 9l3-6c1 0 2 .8 2 2v3h4a1.5 1.5 0 0 1 1.4 2l-1.5 7a1 1 0 0 1-1 .8H8V9z"
          stroke="#d97706"
          strokeWidth="1.3"
          strokeLinejoin="round"
          fill="#fbbf24"
          opacity="0.35"
        />
      </svg>
    ),
    bgColor: "#fef9c3",
    title: "Answer Feedback",
    description:
      "Thumbs up/down on each response to help improve answer quality.",
  },
];

export default function InfoModal({ open, onClose }: InfoModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("usage");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setTimeout(() => closeRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Information and help"
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--color-bg-modal-overlay)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-bg-secondary)",
          borderRadius: "var(--radius-xl)",
          maxWidth: 580,
          width: "92%",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-xl)",
          animation: "scaleIn 0.25s ease",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="var(--color-text-primary)"
                strokeWidth="1.5"
              />
              <path
                d="M10 9v4M10 7v.01"
                stroke="var(--color-text-primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <h2
              style={{
                fontSize: "var(--font-size-xl)",
                fontWeight: 700,
              }}
            >
              PSEG {APP_SUBTITLE}
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background var(--transition-fast)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--color-bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M4.5 4.5l9 9M13.5 4.5l-9 9"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          style={{
            display: "flex",
            gap: 0,
            padding: "16px 24px 0",
            borderBottom: "1px solid var(--color-border-light)",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 16px 12px",
                fontSize: "var(--font-size-sm)",
                fontWeight: activeTab === tab.id ? 600 : 400,
                color:
                  activeTab === tab.id
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid var(--color-accent)"
                    : "2px solid transparent",
                transition: "all var(--transition-fast)",
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          role="tabpanel"
          style={{
            padding: "20px 24px 0",
            overflowY: "auto",
            fontSize: "var(--font-size-sm)",
            lineHeight: 1.7,
            color: "var(--color-text-secondary)",
            flex: 1,
          }}
        >
          {activeTab === "usage" && (
            <div>
              {/* Name callout */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-primary)",
                  marginBottom: "var(--spacing-lg)",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: 4,
                  }}
                >
                  Why did we ask for your name?
                </div>
                <div style={{ fontSize: "var(--font-size-sm)", lineHeight: 1.6 }}>
                  Your name is stored only in this browser and is sent with each
                  request so the system can save your conversations separately from
                  other users. This means your chat history is private to you &mdash;
                  no one else will see your questions or conversations. If you clear
                  your browser data, you&apos;ll be asked again and will start fresh.
                </div>
              </div>

              <h3
                style={{
                  fontSize: "var(--font-size-base)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                Getting Started
              </h3>
              <ol
                style={{
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginBottom: "var(--spacing-lg)",
                }}
              >
                <li>
                  Click <strong>New Chat</strong> in the sidebar to start a
                  conversation.
                </li>
                <li>
                  Type your question about PSEG technical manuals in the input box
                  at the bottom.
                </li>
                <li>
                  Press <strong>Enter</strong> or click the send button.
                </li>
                <li>
                  The assistant will search relevant documents and provide a
                  grounded answer with citations.
                </li>
              </ol>

              <h3
                style={{
                  fontSize: "var(--font-size-base)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                Tips for Better Answers
              </h3>
              <ul
                style={{
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginBottom: "var(--spacing-lg)",
                }}
              >
                <li>
                  Be specific &mdash; include equipment names, model numbers, or
                  procedure names.
                </li>
                <li>
                  Ask follow-up questions in the same conversation for context
                  continuity.
                </li>
                <li>
                  Use the source citations to verify answers against the original
                  documents.
                </li>
              </ul>
            </div>
          )}

          {activeTab === "features" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-sm)",
              }}
            >
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border-light)",
                    background: "var(--color-bg-primary)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--spacing-md)",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-md)",
                      background: feature.bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                        marginBottom: 2,
                      }}
                    >
                      {feature.title}
                    </div>
                    <div style={{ fontSize: "var(--font-size-sm)" }}>
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "whats-new" && (
            <div>
              <Section title="v2.0 \u2014 Current Release">
                Redesigned interface with improved chat experience, PSEG branding,
                conversation management, streaming responses, citation panel,
                feedback system, dark mode support, and enhanced performance.
              </Section>
              <Section title="v1.0.0">
                Initial release with basic chat functionality, document search,
                and citation support.
              </Section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid var(--color-border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "var(--font-size-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            PSEG {APP_SUBTITLE} {APP_VERSION}
          </span>
          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-accent-orange)",
              background: "transparent",
              color: "var(--color-accent-orange)",
              fontWeight: 600,
              fontSize: "var(--font-size-sm)",
              textDecoration: "none",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-accent-orange)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-accent-orange)";
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
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "var(--spacing-lg)" }}>
      <h3
        style={{
          fontSize: "var(--font-size-sm)",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          marginBottom: "var(--spacing-xs)",
        }}
      >
        {title}
      </h3>
      <p>{children}</p>
    </div>
  );
}
