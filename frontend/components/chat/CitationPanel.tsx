"use client";

import { useState } from "react";
import type { Citation } from "@/lib/types";

interface CitationPanelProps {
  citations: Citation[];
}

export default function CitationPanel({ citations }: CitationPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (citations.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "var(--spacing-sm)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border-light)",
        background: "var(--color-bg-citation)",
        overflow: "hidden",
      }}
    >
      {/* Header — clickable to toggle */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-label={`${collapsed ? "Show" : "Hide"} ${citations.length} sources`}
        style={{
          width: "100%",
          padding: "8px 14px",
          background: "var(--color-bg-hover)",
          borderBottom: collapsed
            ? "none"
            : "1px solid var(--color-border-light)",
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-sm)",
          cursor: "pointer",
          transition: "background var(--transition-fast)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--color-bg-active)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--color-bg-hover)")
        }
      >
        {/* Book icon */}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 3a1 1 0 0 1 1-1h3.5a2 2 0 0 1 1.5.67A2 2 0 0 1 9.5 2H13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9.5a1.5 1.5 0 0 0-1.5 1.5A1.5 1.5 0 0 0 6.5 13H3a1 1 0 0 1-1-1V3z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M8 3.5V14" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span
          style={{
            fontSize: "var(--font-size-xs)",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            flex: 1,
            textAlign: "left",
          }}
        >
          Sources ({citations.length})
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transition: "transform var(--transition-fast)",
            transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
            color: "var(--color-text-muted)",
          }}
        >
          <path
            d="M3 4.5l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Citation items */}
      {!collapsed && (
        <div style={{ padding: "6px" }}>
          {citations.map((c, idx) => {
            const displayTitle = c.title || c.source || "Untitled Document";
            const hasUrl = Boolean(c.url);
            const sectionText = [c.section, c.page ? `Page ${c.page}` : ""]
              .filter(Boolean)
              .join(" \u00B7 ");

            return (
              <div
                key={c.chunk_id || `${c.source}-${idx}`}
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "var(--spacing-md)",
                  borderBottom:
                    idx < citations.length - 1
                      ? "1px solid var(--color-border-light)"
                      : "none",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    title={displayTitle}
                    style={{
                      fontSize: "var(--font-size-sm)",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      marginBottom: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {displayTitle}
                  </div>
                  {sectionText && (
                    <div
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--color-text-muted)",
                        marginBottom: 2,
                      }}
                    >
                      {sectionText}
                    </div>
                  )}
                </div>
                {hasUrl ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open PDF: ${displayTitle}`}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg-secondary)",
                      fontSize: "var(--font-size-2xs)",
                      fontWeight: 600,
                      color: "var(--color-accent)",
                      whiteSpace: "nowrap",
                      transition: "all var(--transition-fast)",
                      flexShrink: 0,
                      marginTop: 2,
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "var(--color-accent)";
                      e.currentTarget.style.color =
                        "var(--color-text-inverse)";
                      e.currentTarget.style.borderColor =
                        "var(--color-accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "var(--color-bg-secondary)";
                      e.currentTarget.style.color = "var(--color-accent)";
                      e.currentTarget.style.borderColor =
                        "var(--color-border)";
                    }}
                  >
                    Open PDF
                  </a>
                ) : (
                  <span
                    aria-label="No link available"
                    style={{
                      padding: "5px 10px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border-light)",
                      fontSize: "var(--font-size-2xs)",
                      fontWeight: 600,
                      color: "var(--color-text-muted)",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      marginTop: 2,
                      opacity: 0.5,
                    }}
                  >
                    No link
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
