import type { Device } from "../types";

function timeAgo(timestamp: number): string {
  const diffSec = Math.round((Date.now() - timestamp) / 1000);
  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  return `${Math.round(diffSec / 60)}m ago`;
}

export function DeviceCard({ device }: { device: Device }) {
  const isOnline = device.status === "online";
  const lowBattery = device.batteryPct <= 20;

  return (
    <div
      className={[
        "rounded-lg border p-3.5 transition-colors",
        isOnline ? "border-graphite-700 bg-graphite-900" : "border-alarm-600/40 bg-alarm-600/5"
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm font-medium text-graphite-100">{device.name}</p>
        <span
          className={[
            "h-2 w-2 rounded-full",
            isOnline ? "bg-signal-500" : "bg-alarm-500"
          ].join(" ")}
        />
      </div>
      <p className="mt-0.5 text-xs text-graphite-400">{device.region}</p>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className={lowBattery ? "font-medium text-beacon-500" : "text-graphite-400"}>
          🔋 {device.batteryPct}%
        </span>
        <span className="text-graphite-400">🌡 {device.tempC}°C</span>
      </div>

      <p className="mt-2 text-[11px] text-graphite-500">
        {isOnline ? `Updated ${timeAgo(device.lastSeen)}` : `Offline since ${timeAgo(device.lastSeen)}`}
      </p>
    </div>
  );
}
