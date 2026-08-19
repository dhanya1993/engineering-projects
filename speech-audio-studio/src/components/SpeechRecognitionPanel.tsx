import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

export function SpeechRecognitionPanel() {
  const { status, transcript, interimTranscript, error, start, stop } = useSpeechRecognition();

  if (status === "unsupported") {
    return (
      <div className="rounded-lg border border-studio-700 bg-studio-900 p-6">
        <p className="text-sm text-studio-300">
          This browser doesn't support the Web Speech API's SpeechRecognition interface. Try Chrome
          or Edge on desktop or Android.
        </p>
      </div>
    );
  }

  const isListening = status === "listening";

  return (
    <div className="rounded-lg border border-studio-700 bg-studio-900 p-6">
      <h2 className="font-display text-lg font-medium text-studio-50">Speech Recognition</h2>
      <p className="mt-1 text-sm text-studio-400">
        Live transcription via <code className="rounded bg-studio-800 px-1 text-tape-400">SpeechRecognition</code>.
        Guards against a real cross-browser bug: calling <code className="rounded bg-studio-800 px-1 text-tape-400">start()</code> while
        a session is already active throws — a fast double-click, or the browser's own
        auto-restart-on-silence, can trigger it. A session lock (see{" "}
        <code className="rounded bg-studio-800 px-1 text-tape-400">useSpeechRecognition.ts</code>) prevents that.
      </p>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={isListening ? stop : start}
          className={[
            "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            isListening
              ? "bg-rec-500 text-white hover:bg-rec-600"
              : "bg-tape-500 text-studio-950 hover:bg-tape-400"
          ].join(" ")}
        >
          <span
            className={[
              "h-2 w-2 rounded-full",
              isListening ? "animate-pulse bg-white" : "bg-studio-950/60"
            ].join(" ")}
          />
          {isListening ? "Stop listening" : "Start listening"}
        </button>
        <span className="text-xs uppercase tracking-wide text-studio-500">{status}</span>
      </div>

      {error && <p className="mt-3 text-sm text-rec-500">{error}</p>}

      <div className="mt-4 min-h-[6rem] rounded-md border border-dashed border-studio-700 bg-studio-950 p-4">
        {transcript || interimTranscript ? (
          <p className="text-sm leading-relaxed text-studio-100">
            {transcript}{" "}
            <span className="text-studio-500">{interimTranscript}</span>
          </p>
        ) : (
          <p className="text-sm text-studio-500">
            Transcript will appear here once you start listening and speak.
          </p>
        )}
      </div>
    </div>
  );
}
