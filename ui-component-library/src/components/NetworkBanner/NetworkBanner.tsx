export type NetworkStatus = "offline" | "reconnecting" | "restored";

export interface NetworkBannerProps {
  status: NetworkStatus;
  /** Called when the "Retry" action is pressed (offline state only). */
  onRetry?: () => void;
  className?: string;
}

const copy: Record<NetworkStatus, { title: string; tone: string }> = {
  offline: { title: "You're offline. Changes will sync once you reconnect.", tone: "bg-ink-800 text-ink-50" },
  reconnecting: { title: "Reconnecting…", tone: "bg-signal-500 text-white" },
  restored: { title: "Back online. Syncing your latest changes.", tone: "bg-ink-600 text-white" }
};

/**
 * Slim banner shown at the top of a screen to reflect connectivity state.
 * Built for the offline-first mobile flows (Lingotran Mobile, Figital) but
 * works identically as a web toast-style bar.
 */
export function NetworkBanner({ status, onRetry, className = "" }: NetworkBannerProps) {
  const { title, tone } = copy[status];
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "flex items-center justify-between gap-3 px-4 py-2 text-sm font-body",
        tone,
        className
      ].join(" ")}
    >
      <span className="flex items-center gap-2">
        <span
          className={[
            "h-2 w-2 rounded-full",
            status === "restored" ? "bg-emerald-300" : "bg-white/70",
            status === "reconnecting" ? "animate-pulse" : ""
          ].join(" ")}
          aria-hidden="true"
        />
        {title}
      </span>
      {status === "offline" && onRetry && (
        <button
          onClick={onRetry}
          className="rounded-sm px-2 py-0.5 text-xs font-medium underline underline-offset-2 hover:opacity-80"
        >
          Retry now
        </button>
      )}
    </div>
  );
}
