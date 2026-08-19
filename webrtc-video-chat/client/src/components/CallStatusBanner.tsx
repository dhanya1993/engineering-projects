import type { CallStatus } from "../types";

const COPY: Record<CallStatus, string> = {
  idle: "",
  joining: "Requesting camera and microphone access…",
  "waiting-for-peer": "Waiting for someone else to join this room…",
  connecting: "Connecting to the other participant…",
  connected: "",
  "peer-left": "The other participant left the call.",
  error: ""
};

export function CallStatusBanner({ status, error }: { status: CallStatus; error: string | null }) {
  if (status === "error" && error) {
    return (
      <div className="rounded-md bg-cue-100 px-4 py-2.5 text-sm font-medium text-cue-600">
        {error}
      </div>
    );
  }

  const message = COPY[status];
  if (!message) return null;

  return (
    <div className="rounded-md bg-wave-100 px-4 py-2.5 text-sm font-medium text-wave-600">
      {message}
    </div>
  );
}
