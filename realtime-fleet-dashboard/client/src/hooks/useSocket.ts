import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export type SocketConnectionState = "connecting" | "connected" | "reconnecting" | "disconnected";

/**
 * Wraps the socket.io-client connection lifecycle. socket.io already
 * handles reconnection internally (exponential backoff by default), but
 * it doesn't surface a clean "are we currently mid-reconnect" boolean on
 * its own — this hook derives one from the connect/disconnect/
 * reconnect_attempt events so the UI can show a real connection-state
 * indicator instead of just "connected: true/false".
 */
export function useSocket(url: string) {
  const [state, setState] = useState<SocketConnectionState>("connecting");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(url, {
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });
    socketRef.current = socket;

    socket.on("connect", () => setState("connected"));
    socket.on("disconnect", () => setState("disconnected"));
    socket.io.on("reconnect_attempt", () => setState("reconnecting"));
    socket.io.on("reconnect", () => setState("connected"));

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [url]);

  return { socket: socketRef, connectionState: state };
}
