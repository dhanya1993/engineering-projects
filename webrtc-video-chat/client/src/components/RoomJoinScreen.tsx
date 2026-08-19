import { useState } from "react";
import type { FormEvent } from "react";

interface RoomJoinScreenProps {
  onJoin: (roomId: string) => void;
}

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function RoomJoinScreen({ onJoin }: RoomJoinScreenProps) {
  const [roomCode, setRoomCode] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (roomCode.trim()) onJoin(roomCode.trim());
  }

  function handleCreateRoom() {
    const code = generateRoomCode();
    setRoomCode(code);
    onJoin(code);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-onyx-700 bg-onyx-900 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-wave-500">WebRTC</p>
        <h1 className="mt-1 font-display text-xl font-semibold text-onyx-50">
          Peer-to-Peer Video Chat
        </h1>
        <p className="mt-2 text-sm text-onyx-400">
          Create a room and share the code, or join one someone shared with you. Each room holds
          exactly two people.
        </p>

        <button
          onClick={handleCreateRoom}
          className="mt-5 w-full rounded-md bg-wave-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-wave-600"
        >
          Create a new room
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-onyx-500">
          <div className="h-px flex-1 bg-onyx-700" />
          or join with a code
          <div className="h-px flex-1 bg-onyx-700" />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="ROOM CODE"
            maxLength={8}
            className="flex-1 rounded-md border border-onyx-600 bg-onyx-800 px-3 py-2 text-center font-mono text-sm uppercase tracking-widest text-onyx-100 placeholder:text-onyx-500 focus:border-wave-500 focus:outline-none focus:ring-2 focus:ring-wave-500/30"
          />
          <button
            type="submit"
            className="rounded-md bg-onyx-700 px-4 py-2 text-sm font-medium text-onyx-100 hover:bg-onyx-600"
          >
            Join
          </button>
        </form>

        <p className="mt-5 text-xs text-onyx-500">
          Requires camera and microphone permission. Works best in Chrome, Edge, or Firefox.
        </p>
      </div>
    </div>
  );
}
