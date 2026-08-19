import { useEffect, useRef, useState } from "react";
import type { Device } from "../types";

export interface ChartPoint {
  time: string;
  online: number;
  offline: number;
}

const MAX_POINTS = 30;

/**
 * The device list updates multiple times per second (once per changed
 * device, not as a batch), which is too noisy to chart directly — this
 * takes a snapshot of the current online/offline split on a fixed
 * interval instead, giving a clean time series regardless of how often
 * the underlying device list actually mutates.
 */
export function useOnlineCountHistory(devices: Device[], sampleIntervalMs = 2000) {
  const [history, setHistory] = useState<ChartPoint[]>([]);
  const devicesRef = useRef(devices);
  devicesRef.current = devices;

  useEffect(() => {
    const interval = setInterval(() => {
      const current = devicesRef.current;
      const online = current.filter((d) => d.status === "online").length;
      const offline = current.length - online;
      const time = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        minute: "2-digit",
        second: "2-digit"
      });

      setHistory((prev) => [...prev, { time, online, offline }].slice(-MAX_POINTS));
    }, sampleIntervalMs);

    return () => clearInterval(interval);
  }, [sampleIntervalMs]);

  return history;
}
