import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Defaults to "primary". */
  variant?: ButtonVariant;
  /** Sizing token. Defaults to "md". */
  size?: ButtonSize;
  /** Shows a spinner and disables interaction. */
  loading?: boolean;
  /** Icon rendered before the label. */
  leadingIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-ink-800 text-ink-50 hover:bg-ink-700 active:bg-ink-900 disabled:bg-ink-300",
  secondary:
    "bg-ink-100 text-ink-800 hover:bg-ink-200 active:bg-ink-200 disabled:bg-ink-50 disabled:text-ink-300",
  ghost:
    "bg-transparent text-ink-700 hover:bg-ink-100 active:bg-ink-200 disabled:text-ink-300",
  danger:
    "bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-600 disabled:bg-danger-100 disabled:text-danger-600/50"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
  lg: "text-base px-5 py-2.5 gap-2"
};

/**
 * Button is the base interactive control used across every other
 * component in this kit (Modal actions, FilterBar apply/reset, Pagination
 * arrows, etc). Keep variants limited on purpose — a small, well-understood
 * set is what keeps a UI consistent across many screens and teams.
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leadingIcon,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-md font-body font-medium",
        "transition-colors duration-150 focus-visible:outline focus-visible:outline-2",
        "focus-visible:outline-offset-2 focus-visible:outline-ink-600 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      ].join(" ")}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        leadingIcon
      )}
      {children}
    </button>
  );
}
