import { useEffect, useState } from "react";
import type { MutableRefObject } from "react";
import type { Socket } from "socket.io-client";
import type { Device, FeedEvent, Presence, Region } from "../types";

const MAX_FEED_EVENTS = 50;

export function useFleetData(socketRef: MutableRefObject<Socket | null>) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [presence, setPresence] = useState<Presence | null>(null);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    function handleInit(initialDevices: Device[]) {
      setDevices(initialDevices);
    }

    function handleUpdate(updated: Device) {
      setDevices((prev) => {
        const index = prev.findIndex((d) => d.id === updated.id);
        if (index === -1) return [...prev, updated];
        const next = [...prev];
        next[index] = updated;
        return next;
      });
    }

    function handleEvent(event: FeedEvent) {
      setEvents((prev) => [event, ...prev].slice(0, MAX_FEED_EVENTS));
    }

    function handlePresence(next: Presence) {
      setPresence(next);
    }

    socket.on("devices:init", handleInit);
    socket.on("device:update", handleUpdate);
    socket.on("event:new", handleEvent);
    socket.on("presence:update", handlePresence);

    return () => {
      socket.off("devices:init", handleInit);
      socket.off("device:update", handleUpdate);
      socket.off("event:new", handleEvent);
      socket.off("presence:update", handlePresence);
    };
  }, [socketRef]);

  function setViewingRegion(region: Region | "ALL") {
    socketRef.current?.emit("viewing:region", region);
  }

  return { devices, events, presence, setViewingRegion };
}
