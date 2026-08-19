import React from "react";

export interface EmptyStateProps {
  /** Short, direct headline — what's missing, not an apology. */
  title: string;
  /** One line describing what to do next. */
  description?: string;
  /** Illustration or icon slot. */
  icon?: React.ReactNode;
  /** Primary call-to-action, e.g. a Button. */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Used whenever a list, report, or search result has nothing to show —
 * "no learners match this filter", "no devices assigned yet", "no tickets
 * open this week". Written as a direction forward, not an apology.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-ink-200 px-6 py-12 text-center",
        className
      ].join(" ")}
    >
      {icon && <div className="text-ink-300">{icon}</div>}
      <div className="space-y-1">
        <p className="font-display text-base font-medium text-ink-800">{title}</p>
        {description && <p className="text-sm text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
