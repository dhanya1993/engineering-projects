import React from "react";

export type StatusTone = "success" | "warning" | "danger" | "neutral" | "info";

export interface StatusBadgeProps {
  /** Determines the badge's color mapping. */
  tone?: StatusTone;
  /** Optional leading dot indicator (defaults to true). */
  showDot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const toneClasses: Record<StatusTone, string> = {
  success: "bg-ink-100 text-ink-700",
  warning: "bg-signal-100 text-signal-600",
  danger: "bg-danger-100 text-danger-600",
  neutral: "bg-ink-50 text-ink-500",
  info: "bg-ink-100 text-ink-600"
};

const dotClasses: Record<StatusTone, string> = {
  success: "bg-ink-500",
  warning: "bg-signal-500",
  danger: "bg-danger-500",
  neutral: "bg-ink-300",
  info: "bg-ink-400"
};

/**
 * Small pill used to communicate record state at a glance — e.g. a
 * teacher's "pending / evaluated" tracking, or a device's online/offline
 * status on an admin console.
 */
export function StatusBadge({
  tone = "neutral",
  showDot = true,
  children,
  className = ""
}: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-body",
        toneClasses[tone],
        className
      ].join(" ")}
    >
      {showDot && (
        <span
          className={["h-1.5 w-1.5 rounded-full", dotClasses[tone]].join(" ")}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
