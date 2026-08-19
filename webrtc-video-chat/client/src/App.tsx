import { useState } from "react";
import { useVideoCall } from "./hooks/useVideoCall";
import { RoomJoinScreen } from "./components/RoomJoinScreen";
import { VideoTile } from "./components/VideoTile";
import { CallControls } from "./components/CallControls";
import { ChatPanel } from "./components/ChatPanel";
import { CallStatusBanner } from "./components/CallStatusBanner";

function CallScreen({ roomId, onLeave }: { roomId: string; onLeave: () => void }) {
  const {
    status,
    error,
    localStream,
    remoteStream,
    micOn,
    cameraOn,
    screenSharing,
    messages,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    sendMessage,
    hangUp
  } = useVideoCall(roomId);

  function handleHangUp() {
    hangUp();
    onLeave();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-wave-500">Room</p>
          <h1 className="font-display text-lg font-semibold text-onyx-50">{roomId}</h1>
        </div>
      </div>

      <CallStatusBanner status={status} error={error} />

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
          <VideoTile stream={localStream} muted label="You" placeholder="Starting camera…" />
          <VideoTile stream={remoteStream} label="Peer" placeholder="Waiting for peer's video…" />
        </div>
        <div className="lg:row-span-2">
          <ChatPanel messages={messages} onSend={sendMessage} />
        </div>
      </div>

      <CallControls
        micOn={micOn}
        cameraOn={cameraOn}
        screenSharing={screenSharing}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={toggleScreenShare}
        onHangUp={handleHangUp}
      />
    </div>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState<string | null>(null);

  if (!roomId) {
    return <RoomJoinScreen onJoin={setRoomId} />;
  }

  return <CallScreen roomId={roomId} onLeave={() => setRoomId(null)} />;
}
