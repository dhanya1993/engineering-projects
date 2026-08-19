import type { SocketConnectionState } from "../hooks/useSocket";

const CONFIG: Record<SocketConnectionState, { label: string; dotClass: string }> = {
  connecting: { label: "Connecting…", dotClass: "bg-beacon-500 animate-pulse" },
  connected: { label: "Live", dotClass: "bg-signal-500" },
  reconnecting: { label: "Reconnecting…", dotClass: "bg-beacon-500 animate-pulse" },
  disconnected: { label: "Disconnected", dotClass: "bg-alarm-500" }
};

export function ConnectionStatus({ state }: { state: SocketConnectionState }) {
  const { label, dotClass } = CONFIG[state];
  return (
    <div className="flex items-center gap-2 rounded-full border border-graphite-700 bg-graphite-900 px-3 py-1.5">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      <span className="text-xs font-medium text-graphite-300">{label}</span>
    </div>
  );
}
