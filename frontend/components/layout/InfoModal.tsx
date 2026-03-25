"use client";

import { useState, useEffect, useRef } from "react";

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

export default function InfoModal({ open, onClose }: InfoModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("usage");
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Focus close button when opened
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
          maxWidth: 540,
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
          <h2
            style={{
              fontSize: "var(--font-size-xl)",
              fontWeight: 700,
            }}
          >
            PSEG Tech Manual Chatbot
          </h2>
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
            padding: "20px 24px 24px",
            overflowY: "auto",
            fontSize: "var(--font-size-sm)",
            lineHeight: 1.7,
            color: "var(--color-text-secondary)",
          }}
        >
          {activeTab === "usage" && (
            <div>
              <Section title="Getting Started">
                Type your question in the chat input at the bottom of the
                screen. The AI assistant will search through PSEG technical
                manuals and documentation to find relevant answers.
              </Section>
              <Section title="Ask Specific Questions">
                For best results, ask specific technical questions such as
                &ldquo;What is the maintenance schedule for 345kV circuit
                breakers?&rdquo; or &ldquo;What PPE is required for substation
                entry?&rdquo;
              </Section>
              <Section title="Review Citations">
                Each response includes citations from source documents. Click
                &ldquo;Open PDF&rdquo; to view the original document section.
              </Section>
              <Section title="Manage Conversations">
                Use the sidebar to create new chats, switch between
                conversations, or delete old ones. Your conversation history
                is saved automatically.
              </Section>
            </div>
          )}
          {activeTab === "features" && (
            <div>
              <Section title="AI-Powered Search">
                Uses retrieval-augmented generation (RAG) to search through
                thousands of pages of technical documentation and return
                accurate, contextual answers.
              </Section>
              <Section title="Citation Tracking">
                Every response includes links to source documents with page
                numbers, so you can verify information and access original
                materials.
              </Section>
              <Section title="Conversation History">
                All conversations are saved and organized in the sidebar.
                Pick up where you left off at any time.
              </Section>
              <Section title="Dark Mode">
                Toggle between light and dark themes using the control in the
                sidebar footer. Your preference is saved automatically.
              </Section>
              <Section title="Enterprise Security">
                Integrated with Azure Active Directory for secure
                authentication. All data stays within PSEG&rsquo;s Azure
                environment.
              </Section>
            </div>
          )}
          {activeTab === "whats-new" && (
            <div>
              <Section title="v2.1.0 — Latest Release">
                Redesigned interface with improved chat experience, better
                citation display, dark mode support, and enhanced performance.
              </Section>
              <Section title="v2.0.0">
                Migrated to Next.js with App Router. New sidebar navigation,
                conversation management, and streaming responses.
              </Section>
              <Section title="v1.0.0">
                Initial release with basic chat functionality, document
                search, and citation support.
              </Section>
            </div>
          )}
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
