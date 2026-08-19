import React from "react";

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Optional title rendered in the card header row. */
  title?: React.ReactNode;
  /** Optional element rendered at the end of the header row (e.g. a StatusBadge or menu button). */
  headerAction?: React.ReactNode;
  /** Optional footer row, separated by a hairline rule. */
  footer?: React.ReactNode;
  /** Removes padding so the card can host edge-to-edge content (tables, images). */
  noPadding?: boolean;
}

/**
 * Generic content container used across admin-console dashboards, report
 * summaries, and learner/device list rows. Deliberately unopinionated about
 * its body content — compose it with whatever the screen needs.
 */
export function Card({
  title,
  headerAction,
  footer,
  noPadding = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        "rounded-lg border border-ink-100 bg-white shadow-[var(--ui-shadow-sm)]",
        className
      ].join(" ")}
      {...rest}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-5 py-3.5">
          {title && (
            <h3 className="font-display text-base font-medium text-ink-900">
              {title}
            </h3>
          )}
          {headerAction}
        </div>
      )}
      <div className={noPadding ? "" : "px-5 py-4"}>{children}</div>
      {footer && (
        <div className="border-t border-ink-100 px-5 py-3 text-sm text-ink-500">
          {footer}
        </div>
      )}
    </div>
  );
}
