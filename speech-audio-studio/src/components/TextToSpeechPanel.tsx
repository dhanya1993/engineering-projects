import { useMemo, useState } from "react";
import { useTextToSpeech } from "../hooks/useTextToSpeech";

const SAMPLE_TEXT =
  "Great job on the last assessment. Let's review question three together — take your time reading it aloud.";

export function TextToSpeechPanel() {
  const { status, voices, speak, pause, resume, cancel } = useTextToSpeech();
  const [text, setText] = useState(SAMPLE_TEXT);
  const [voiceURI, setVoiceURI] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const englishVoices = useMemo(
    () => voices.filter((v) => v.lang.toLowerCase().startsWith("en")),
    [voices]
  );

  if (status === "unsupported") {
    return (
      <div className="rounded-lg border border-studio-700 bg-studio-900 p-6">
        <p className="text-sm text-studio-300">
          This browser doesn't support the Web Speech API's speech synthesis. Try Chrome, Edge, or
          Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-studio-700 bg-studio-900 p-6">
      <h2 className="font-display text-lg font-medium text-studio-50">Text to Speech</h2>
      <p className="mt-1 text-sm text-studio-400">
        Uses <code className="rounded bg-studio-800 px-1 text-tape-400">speechSynthesis</code>. Voice
        lists load asynchronously in most browsers — this loads them via the{" "}
        <code className="rounded bg-studio-800 px-1 text-tape-400">voiceschanged</code> event instead
        of assuming they're ready on first render.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="mt-4 w-full rounded-md border border-studio-700 bg-studio-950 px-3 py-2 text-sm text-studio-100 focus:border-tape-500 focus:outline-none focus:ring-2 focus:ring-tape-500/30"
      />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="text-xs text-studio-400">
          Voice
          <select
            value={voiceURI}
            onChange={(e) => setVoiceURI(e.target.value)}
            className="mt-1 w-full rounded-md border border-studio-700 bg-studio-950 px-2 py-1.5 text-sm text-studio-100"
          >
            <option value="">Browser default</option>
            {englishVoices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-studio-400">
          Rate: {rate.toFixed(1)}×
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-2 w-full accent-tape-500"
          />
        </label>

        <label className="text-xs text-studio-400">
          Pitch: {pitch.toFixed(1)}
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            className="mt-2 w-full accent-tape-500"
          />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          onClick={() => speak(text, { voiceURI, rate, pitch })}
          disabled={status === "speaking" || !text.trim()}
          className="rounded-md bg-tape-500 px-4 py-2 text-sm font-medium text-studio-950 hover:bg-tape-400 disabled:bg-studio-700 disabled:text-studio-500"
        >
          Speak
        </button>
        {status === "speaking" && (
          <button
            onClick={pause}
            className="rounded-md bg-studio-700 px-3 py-2 text-sm font-medium text-studio-100 hover:bg-studio-600"
          >
            Pause
          </button>
        )}
        {status === "paused" && (
          <button
            onClick={resume}
            className="rounded-md bg-studio-700 px-3 py-2 text-sm font-medium text-studio-100 hover:bg-studio-600"
          >
            Resume
          </button>
        )}
        {(status === "speaking" || status === "paused") && (
          <button
            onClick={cancel}
            className="rounded-md bg-studio-800 px-3 py-2 text-sm font-medium text-studio-300 hover:bg-studio-700"
          >
            Stop
          </button>
        )}
        <span className="ml-auto text-xs uppercase tracking-wide text-studio-500">{status}</span>
      </div>
    </div>
  );
}
