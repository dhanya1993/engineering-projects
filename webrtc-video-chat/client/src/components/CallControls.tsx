interface CallControlsProps {
  micOn: boolean;
  cameraOn: boolean;
  screenSharing: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onHangUp: () => void;
}

function ControlButton({
  active,
  onClick,
  label,
  danger
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
        danger
          ? "bg-cue-500 text-white hover:bg-cue-600"
          : active
          ? "bg-onyx-700 text-white hover:bg-onyx-600"
          : "bg-cue-500/90 text-white hover:bg-cue-500"
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export function CallControls({
  micOn,
  cameraOn,
  screenSharing,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onHangUp
}: CallControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <ControlButton active={micOn} onClick={onToggleMic} label={micOn ? "Mute" : "Unmute"} />
      <ControlButton
        active={cameraOn}
        onClick={onToggleCamera}
        label={cameraOn ? "Stop video" : "Start video"}
      />
      <ControlButton
        active={screenSharing}
        onClick={onToggleScreenShare}
        label={screenSharing ? "Stop sharing" : "Share screen"}
      />
      <ControlButton onClick={onHangUp} label="Leave call" danger />
    </div>
  );
}
