"use client";

interface StatusBadgeProps {
  status: "online" | "offline" | "error";
  label?: string;
}

const STATUS_COLORS = {
  online: "#2e7d32",
  offline: "#b0b0b0",
  error: "#d32f2f",
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: "var(--font-size-2xs)",
        color: status === "online" ? STATUS_COLORS.online : "var(--color-text-sidebar-muted)",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: STATUS_COLORS[status],
          boxShadow: status === "online" ? "0 0 6px rgba(46, 125, 50, 0.4)" : "none",
          animation: status === "online" ? "pulse 2s ease-in-out infinite" : "none",
        }}
      />
      {label ?? status}
    </span>
  );
}
