import { useEffect, useRef } from "react";

interface VideoTileProps {
  stream: MediaStream | null;
  muted?: boolean;
  label: string;
  placeholder?: string;
}

export function VideoTile({ stream, muted, label, placeholder }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-onyx-800">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-onyx-500">
          {placeholder ?? "Waiting for video…"}
        </div>
      )}
      <span className="absolute bottom-2 left-2 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white">
        {label}
      </span>
    </div>
  );
}
