import { randomInt, randomChoice, clamp } from "../utils/random.js";

export const REGIONS = ["North", "South", "East", "West"];

const DEVICE_NAMES_PER_REGION = 6;

function makeDevice(id, region) {
  return {
    id,
    name: `DVC-${id.toString().padStart(3, "0")}`,
    region,
    status: "online",
    batteryPct: randomInt(55, 100),
    tempC: randomInt(18, 28),
    lastSeen: Date.now()
  };
}

/**
 * Owns the in-memory fleet state and ticks it forward on an interval,
 * emitting fine-grained events rather than re-broadcasting the whole
 * fleet every tick — the same shape a real telemetry pipeline would use
 * (per-device delta events), which is also just far cheaper on the wire
 * than re-sending 24 device objects every two seconds.
 */
export function createDeviceSimulator({ onDeviceUpdate, onEvent }) {
  let devices = [];
  let idCounter = 1;

  for (const region of REGIONS) {
    for (let i = 0; i < DEVICE_NAMES_PER_REGION; i++) {
      devices.push(makeDevice(idCounter++, region));
    }
  }

  function getSnapshot() {
    return devices.map((d) => ({ ...d }));
  }

  function tick() {
    // Update a handful of random devices each tick rather than all of
    // them — a real fleet doesn't report in perfect lockstep, and this
    // makes the live feed read like actual telemetry instead of a
    // synchronized blink.
    const updateCount = randomInt(2, 5);
    const indices = new Set();
    while (indices.size < updateCount && indices.size < devices.length) {
      indices.add(randomInt(0, devices.length - 1));
    }

    for (const index of indices) {
      const device = devices[index];
      const wasOnline = device.status === "online";

      // Small chance of a status flip each tick a device is touched.
      const flips = Math.random() < 0.08;
      const nextStatus = flips ? (wasOnline ? "offline" : "online") : device.status;

      const nextBattery = wasOnline
        ? clamp(device.batteryPct - randomInt(0, 2), 0, 100)
        : device.batteryPct;
      const nextTemp = clamp(device.tempC + randomInt(-1, 1), 15, 35);

      const updated = {
        ...device,
        status: nextStatus,
        batteryPct: nextBattery,
        tempC: nextTemp,
        lastSeen: nextStatus === "online" ? Date.now() : device.lastSeen
      };

      devices[index] = updated;
      onDeviceUpdate(updated);

      if (flips) {
        onEvent({
          id: `evt-${Date.now()}-${device.id}`,
          type: nextStatus === "offline" ? "alert" : "info",
          message:
            nextStatus === "offline"
              ? `${device.name} (${device.region}) went offline.`
              : `${device.name} (${device.region}) is back online.`,
          timestamp: Date.now()
        });
      } else if (nextBattery <= 15 && device.batteryPct > 15) {
        onEvent({
          id: `evt-${Date.now()}-${device.id}-batt`,
          type: "alert",
          message: `${device.name} (${device.region}) battery is critically low (${nextBattery}%).`,
          timestamp: Date.now()
        });
      }
    }
  }

  let interval = null;

  function start(intervalMs = 2000) {
    if (interval) return;
    interval = setInterval(tick, intervalMs);
  }

  function stop() {
    if (interval) clearInterval(interval);
    interval = null;
  }

  return { getSnapshot, start, stop };
}
