import React from "react";

export interface HeaderProps {
  /** Main product/section title, e.g. "Teacher Dashboard". */
  title: string;
  /** Optional subtitle shown beneath the title. */
  subtitle?: string;
  /** Logo or icon slot rendered before the title. */
  logo?: React.ReactNode;
  /** Right-aligned actions — search, notifications, avatar menu, etc. */
  actions?: React.ReactNode;
  /** Sticks the header to the top of its scroll container. */
  sticky?: boolean;
  className?: string;
}

/**
 * Top-level app header used consistently across web admin consoles and
 * dashboards. Kept intentionally simple — a title/subtitle slot and a
 * flexible actions region — so each product can drop in its own nav or
 * search without forking the component.
 */
export function Header({
  title,
  subtitle,
  logo,
  actions,
  sticky = false,
  className = ""
}: HeaderProps) {
  return (
    <header
      className={[
        "flex items-center justify-between gap-4 border-b border-ink-100 bg-white px-6 py-3.5",
        sticky ? "sticky top-0 z-20" : "",
        className
      ].join(" ")}
    >
      <div className="flex items-center gap-3 min-w-0">
        {logo}
        <div className="min-w-0">
          <h1 className="truncate font-display text-lg font-semibold text-ink-900">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-xs text-ink-500 font-body">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
