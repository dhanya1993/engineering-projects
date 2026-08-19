import React, { useEffect, useRef } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Constrain modal width. Defaults to "md". */
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl"
};

/**
 * Accessible dialog used for confirmations, forms, and detail drill-ins
 * across the admin console and web platforms. Handles focus trapping
 * basics, Escape-to-close, and backdrop click — consumers only manage the
 * `open` boolean and content.
 */
export function Modal({ open, onClose, title, children, footer, size = "md" }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "ui-modal-title" : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={[
          "w-full rounded-lg bg-white shadow-[var(--ui-shadow-md)] outline-none",
          sizeClasses[size]
        ].join(" ")}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 id="ui-modal-title" className="font-display text-lg font-medium text-ink-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-sm p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
            >
              ✕
            </button>
          </div>
        )}
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-ink-100 px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
