"use client";

import { useEffect, useRef } from "react";

interface PdfViewerProps {
  url: string;
  title: string;
  section?: string;
  page?: string;
  onClose: () => void;
}

/**
 * Slide-out PDF viewer panel.
 * - Desktop: slides in from the right, takes ~45% of the screen
 * - Mobile (<768px): opens full-screen with close button
 * - Appends #page=N to the URL if page number is available
 */
export default function PdfViewer({
  url,
  title,
  section,
  page,
  onClose,
}: PdfViewerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Build URL with page fragment
  const pdfUrl = page ? `${url}#page=${page}` : url;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop — click to close */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.35)",
          zIndex: 900,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(55%, 800px)",
          minWidth: 360,
          background: "var(--color-bg-secondary)",
          zIndex: 901,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
          animation: "slideInRight 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
            background: "var(--color-bg-suggestion)",
          }}
        >
          {/* PDF icon */}
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path
              d="M4 1h5.5L13 4.5V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"
              stroke="var(--color-danger)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M9 1v4h4"
              stroke="var(--color-danger)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "var(--font-size-sm)",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </div>
            {(section || page) && (
              <div
                style={{
                  fontSize: "var(--font-size-2xs)",
                  color: "var(--color-text-muted)",
                  marginTop: 1,
                }}
              >
                {[section, page ? `Page ${page}` : ""].filter(Boolean).join(" \u00B7 ")}
              </div>
            )}
          </div>

          {/* Open in new tab */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new tab"
            style={{
              width: 30,
              height: 30,
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-muted)",
              transition: "all var(--transition-fast)",
              textDecoration: "none",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-bg-hover)";
              e.currentTarget.style.color = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3H3v10h10v-3M9 2h5v5M14 2L7 9"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close PDF viewer"
            title="Close (Esc)"
            style={{
              width: 30,
              height: 30,
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-muted)",
              transition: "all var(--transition-fast)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-bg-hover)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* PDF iframe */}
        <div style={{ flex: 1, position: "relative", background: "#525659" }}>
          <iframe
            src={pdfUrl}
            title={`PDF: ${title}`}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
          {/* Fallback message if iframe doesn't load */}
          <noscript>
            <div style={{ padding: 20, color: "#fff", textAlign: "center" }}>
              Unable to display PDF. <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Open in new tab</a>
            </div>
          </noscript>
        </div>
      </div>
    </>
  );
}
