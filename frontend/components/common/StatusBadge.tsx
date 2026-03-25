"use client";

interface StatusBadgeProps {
  status: "online" | "offline" | "error";
  label?: string;
}

const STATUS_COLORS = {
  online: "#4ade80",
  offline: "var(--color-text-sidebar-muted)",
  error: "#f87171",
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: "var(--font-size-2xs)",
        color: "var(--color-text-sidebar-muted)",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: STATUS_COLORS[status],
          boxShadow: status === "online" ? "0 0 6px rgba(74, 222, 128, 0.4)" : "none",
          animation: status === "online" ? "pulse 2s ease-in-out infinite" : "none",
        }}
      />
      {label ?? status}
    </span>
  );
}
