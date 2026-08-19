import type { Presence, Region } from "../types";

export function PresenceIndicator({
  presence,
  activeRegion
}: {
  presence: Presence | null;
  activeRegion: Region | "ALL";
}) {
  if (!presence) return null;
  const viewingCount = presence[activeRegion];

  return (
    <div className="flex items-center gap-1.5 text-xs text-graphite-400">
      <span className="flex -space-x-1">
        {Array.from({ length: Math.min(viewingCount, 3) }).map((_, i) => (
          <span
            key={i}
            className="h-4 w-4 rounded-full border border-graphite-900 bg-signal-500/70"
          />
        ))}
      </span>
      {viewingCount} {viewingCount === 1 ? "person" : "people"} viewing this{" "}
      {activeRegion === "ALL" ? "dashboard" : `${activeRegion} region`} · {presence.total} total online
    </div>
  );
}
