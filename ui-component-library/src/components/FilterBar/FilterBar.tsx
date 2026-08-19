import { Button } from "../Button/Button";

export interface FilterOption {
  key: string;
  label: string;
}

export interface FilterBarProps {
  /** Current search text. */
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  /** Chip-style filter options (e.g. cohort, status, lesson-journey). */
  filters?: FilterOption[];
  activeFilterKey?: string;
  onFilterChange?: (key: string) => void;
  /** Shown when at least one filter/search is active. */
  onReset?: () => void;
  className?: string;
}

/**
 * Combined search + chip-filter row used above learner lists, ticket
 * queues, and report tables. Search and filters are deliberately
 * decoupled from data-fetching — this component only reports intent.
 */
export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters = [],
  activeFilterKey,
  onFilterChange,
  onReset,
  className = ""
}: FilterBarProps) {
  const isActive = searchValue.length > 0 || (!!activeFilterKey && activeFilterKey !== filters[0]?.key);

  return (
    <div className={["flex flex-wrap items-center gap-3", className].join(" ")}>
      <div className="relative">
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-56 rounded-md border border-ink-200 bg-white py-2 pl-8 pr-3 text-sm font-body
                     placeholder:text-ink-300 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/30"
        />
        <span className="pointer-events-none absolute left-2.5 top-2.5 text-ink-300" aria-hidden="true">
          ⌕
        </span>
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filters.map((filter) => {
            const active = filter.key === activeFilterKey;
            return (
              <button
                key={filter.key}
                onClick={() => onFilterChange?.(filter.key)}
                className={[
                  "rounded-full border px-3 py-1 text-xs font-medium font-body transition-colors",
                  active
                    ? "border-ink-800 bg-ink-800 text-white"
                    : "border-ink-200 text-ink-600 hover:border-ink-400"
                ].join(" ")}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      )}

      {isActive && onReset && (
        <Button size="sm" variant="ghost" onClick={onReset}>
          Clear all
        </Button>
      )}
    </div>
  );
}
