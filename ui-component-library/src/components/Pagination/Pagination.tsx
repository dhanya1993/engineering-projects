import React from "react";
import { Button } from "../Button/Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Max number of numbered page buttons shown before collapsing with an ellipsis. */
  maxVisible?: number;
  className?: string;
}

function getVisiblePages(current: number, total: number, maxVisible: number) {
  if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current]);
  const spread = Math.floor((maxVisible - 3) / 2);
  for (let i = 1; i <= spread; i++) {
    pages.add(Math.max(1, current - i));
    pages.add(Math.min(total, current + i));
  }
  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Numbered pagination with collapsing ellipses, used across learner
 * lists, ticket queues, and report tables. Purely presentational — the
 * consumer owns the actual page-slicing logic.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 7,
  className = ""
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const visible = getVisiblePages(currentPage, totalPages, maxVisible);

  return (
    <nav
      aria-label="Pagination"
      className={["flex items-center gap-1", className].join(" ")}
    >
      <Button
        size="sm"
        variant="ghost"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        ‹
      </Button>

      {visible.map((page, idx) => {
        const prev = visible[idx - 1];
        const showEllipsis = prev !== undefined && page - prev > 1;
        return (
          <React.Fragment key={page}>
            {showEllipsis && <span className="px-1 text-ink-300">…</span>}
            <button
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={[
                "h-8 w-8 rounded-md text-sm font-medium font-body transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink-600",
                page === currentPage
                  ? "bg-ink-800 text-white"
                  : "text-ink-600 hover:bg-ink-100"
              ].join(" ")}
            >
              {page}
            </button>
          </React.Fragment>
        );
      })}

      <Button
        size="sm"
        variant="ghost"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        ›
      </Button>
    </nav>
  );
}
