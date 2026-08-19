import React from "react";

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  /** Optional count shown as a small trailing badge (e.g. unread items). */
  count?: number;
  disabled?: boolean;
}

export interface TabBarProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  /** "underline" for web-style top nav, "pill" for mobile-style segmented control. */
  variant?: "underline" | "pill";
  className?: string;
}

/**
 * Shared tab navigation used across web (underline style) and the mobile
 * equivalent bottom/segmented navigation (pill style). Consumers pass one
 * data shape and only need to swap the variant when moving between
 * platforms.
 */
export function TabBar({
  items,
  activeKey,
  onChange,
  variant = "underline",
  className = ""
}: TabBarProps) {
  const isPill = variant === "pill";

  return (
    <div
      role="tablist"
      className={[
        isPill
          ? "inline-flex gap-1 rounded-md bg-ink-50 p-1"
          : "flex gap-6 border-b border-ink-100",
        className
      ].join(" ")}
    >
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <button
            key={item.key}
            role="tab"
            aria-selected={active}
            disabled={item.disabled}
            onClick={() => onChange(item.key)}
            className={[
              "flex items-center gap-1.5 font-body text-sm font-medium transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink-600",
              item.disabled ? "cursor-not-allowed text-ink-300" : "",
              isPill
                ? [
                    "rounded-sm px-3 py-1.5",
                    active ? "bg-white text-ink-900 shadow-[var(--ui-shadow-sm)]" : "text-ink-500 hover:text-ink-700"
                  ].join(" ")
                : [
                    "-mb-px border-b-2 pb-2.5 pt-1",
                    active
                      ? "border-ink-800 text-ink-900"
                      : "border-transparent text-ink-500 hover:text-ink-700"
                  ].join(" ")
            ].join(" ")}
          >
            {item.icon}
            {item.label}
            {typeof item.count === "number" && (
              <span
                className={[
                  "rounded-full px-1.5 text-xs",
                  active ? "bg-ink-800 text-white" : "bg-ink-100 text-ink-500"
                ].join(" ")}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
