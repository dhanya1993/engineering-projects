import type { Device } from "../types";

function StatBlock({ label, value, tone }: { label: string; value: string; tone?: "alarm" | "signal" }) {
  return (
    <div className="rounded-lg border border-graphite-700 bg-graphite-900 px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-graphite-400">{label}</p>
      <p
        className={[
          "mt-1 font-display text-xl font-semibold",
          tone === "alarm" ? "text-alarm-500" : tone === "signal" ? "text-signal-500" : "text-graphite-100"
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

export function StatSummary({ devices }: { devices: Device[] }) {
  const online = devices.filter((d) => d.status === "online").length;
  const offline = devices.length - online;
  const avgBattery = devices.length
    ? Math.round(devices.reduce((sum, d) => sum + d.batteryPct, 0) / devices.length)
    : 0;
  const lowBatteryCount = devices.filter((d) => d.batteryPct <= 20).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatBlock label="Online" value={String(online)} tone="signal" />
      <StatBlock label="Offline" value={String(offline)} tone={offline > 0 ? "alarm" : undefined} />
      <StatBlock label="Avg. battery" value={`${avgBattery}%`} />
      <StatBlock
        label="Low battery"
        value={String(lowBatteryCount)}
        tone={lowBatteryCount > 0 ? "alarm" : undefined}
      />
    </div>
  );
}
