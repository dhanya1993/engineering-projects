import type { FeedEvent } from "../types";

function timeAgo(timestamp: number): string {
  const diffSec = Math.round((Date.now() - timestamp) / 1000);
  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  return `${Math.round(diffSec / 60)}m ago`;
}

export function ActivityFeed({ events }: { events: FeedEvent[] }) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-graphite-700 bg-graphite-900 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-graphite-400">
        Live activity feed
      </p>
      <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
        {events.length === 0 && (
          <p className="text-sm text-graphite-500">Waiting for the first event…</p>
        )}
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-2 text-sm">
            <span
              className={[
                "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                event.type === "alert" ? "bg-alarm-500" : "bg-signal-500"
              ].join(" ")}
            />
            <div>
              <p className="text-graphite-200">{event.message}</p>
              <p className="text-[11px] text-graphite-500">{timeAgo(event.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
