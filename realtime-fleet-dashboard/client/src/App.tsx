import { useState } from "react";
import type { Region } from "./types";
import { useSocket } from "./hooks/useSocket";
import { useFleetData } from "./hooks/useFleetData";
import { useOnlineCountHistory } from "./hooks/useOnlineCountHistory";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { PresenceIndicator } from "./components/PresenceIndicator";
import { RegionFilter } from "./components/RegionFilter";
import { StatSummary } from "./components/StatSummary";
import { DeviceCard } from "./components/DeviceCard";
import { LiveChart } from "./components/LiveChart";
import { ActivityFeed } from "./components/ActivityFeed";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export default function App() {
  const { socket, connectionState } = useSocket(SOCKET_URL);
  const { devices, events, presence, setViewingRegion } = useFleetData(socket);
  const [activeRegion, setActiveRegion] = useState<Region | "ALL">("ALL");

  const history = useOnlineCountHistory(devices);

  const visibleDevices =
    activeRegion === "ALL" ? devices : devices.filter((d) => d.region === activeRegion);

  function handleRegionChange(region: Region | "ALL") {
    setActiveRegion(region);
    setViewingRegion(region);
  }

  return (
    <div className="min-h-screen px-5 py-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal-500">
            Fleet Pulse
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-graphite-50">
            Live Device Dashboard
          </h1>
        </div>
        <ConnectionStatus state={connectionState} />
      </header>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <RegionFilter active={activeRegion} onChange={handleRegionChange} />
        <PresenceIndicator presence={presence} activeRegion={activeRegion} />
      </div>

      <div className="mt-5">
        <StatSummary devices={visibleDevices} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LiveChart data={history} />
        </div>
        <div className="lg:row-span-2">
          <ActivityFeed events={events} />
        </div>

        <div className="lg:col-span-2">
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {visibleDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-8 text-xs text-graphite-500">
        No database — the server simulates a live fleet of 24 devices in memory. Every device
        card, chart point, and feed entry above is pushed over a real Socket.IO connection, not
        polled.
      </footer>
    </div>
  );
}
