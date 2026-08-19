import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { formatDuration } from "../utils/format";

export function AudioRecorderPanel() {
  const { status, recording, error, elapsedMs, start, stop, pause, resume, reset } =
    useAudioRecorder();

  const isRecording = status === "recording";
  const isPaused = status === "paused";

  return (
    <div className="rounded-lg border border-studio-700 bg-studio-900 p-6">
      <h2 className="font-display text-lg font-medium text-studio-50">Audio Recorder</h2>
      <p className="mt-1 text-sm text-studio-400">
        Records through <code className="rounded bg-studio-800 px-1 text-tape-400">MediaRecorder</code>,
        probing a list of supported MIME types so the same code works across Chrome, Firefox, and
        Safari (including iOS's narrower codec support).
      </p>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={isRecording || isPaused ? undefined : start}
          disabled={isRecording || isPaused}
          className={[
            "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
            isRecording
              ? "bg-rec-500 animate-pulse"
              : "bg-rec-600 hover:bg-rec-500 disabled:bg-studio-700"
          ].join(" ")}
          aria-label="Start recording"
        >
          <span className="h-5 w-5 rounded-full bg-white" />
        </button>

        <div>
          <p className="font-mono text-2xl text-studio-50">{formatDuration(elapsedMs)}</p>
          <p className="text-xs uppercase tracking-wide text-studio-500">
            {status === "idle" && "Ready"}
            {isRecording && "Recording…"}
            {isPaused && "Paused"}
            {status === "stopped" && "Stopped"}
            {status === "error" && "Error"}
          </p>
        </div>

        <div className="ml-auto flex gap-2">
          {isRecording && (
            <button
              onClick={pause}
              className="rounded-md bg-studio-700 px-3 py-2 text-sm font-medium text-studio-100 hover:bg-studio-600"
            >
              Pause
            </button>
          )}
          {isPaused && (
            <button
              onClick={resume}
              className="rounded-md bg-studio-700 px-3 py-2 text-sm font-medium text-studio-100 hover:bg-studio-600"
            >
              Resume
            </button>
          )}
          {(isRecording || isPaused) && (
            <button
              onClick={stop}
              className="rounded-md bg-tape-500 px-3 py-2 text-sm font-medium text-studio-950 hover:bg-tape-400"
            >
              Stop
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-rec-500">{error}</p>}

      {recording && (
        <div className="mt-6 rounded-md border border-studio-700 bg-studio-950 p-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-studio-500">
            Playback · {recording.mimeType} · {formatDuration(recording.durationMs)}
          </p>
          <audio controls src={recording.url} className="w-full" />
          <div className="mt-3 flex gap-2">
            <a
              href={recording.url}
              download={`recording.${recording.mimeType.includes("mp4") ? "m4a" : "webm"}`}
              className="rounded-md bg-studio-800 px-3 py-1.5 text-xs font-medium text-studio-200 hover:bg-studio-700"
            >
              Download
            </a>
            <button
              onClick={reset}
              className="rounded-md bg-studio-800 px-3 py-1.5 text-xs font-medium text-studio-200 hover:bg-studio-700"
            >
              Record again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
