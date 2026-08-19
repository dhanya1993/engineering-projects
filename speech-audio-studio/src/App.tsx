import { useState } from "react";
import { TabBar } from "./components/TabBar";
import { AudioRecorderPanel } from "./components/AudioRecorderPanel";
import { TextToSpeechPanel } from "./components/TextToSpeechPanel";
import { SpeechRecognitionPanel } from "./components/SpeechRecognitionPanel";

const TABS = [
  { key: "recorder", label: "Audio Recorder" },
  { key: "tts", label: "Text to Speech" },
  { key: "stt", label: "Speech Recognition" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("recorder");

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-tape-500">
            Speech · Audio · TTS
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-studio-50">
            Browser Recording Studio
          </h1>
          <p className="mt-2 max-w-xl text-sm text-studio-400">
            A standalone demo of the audio/speech features behind an e-learning platform's
            assessment tools: cross-browser recording, text-to-speech, and live speech
            recognition — all running on native Web APIs, no server or API key required.
          </p>
        </header>

        <TabBar items={TABS} activeKey={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "recorder" && <AudioRecorderPanel />}
          {activeTab === "tts" && <TextToSpeechPanel />}
          {activeTab === "stt" && <SpeechRecognitionPanel />}
        </div>

        <footer className="mt-10 border-t border-studio-800 pt-4 text-xs text-studio-500">
          Recording and recognition require microphone permission. Speech recognition support
          varies by browser — Chrome and Edge have the widest support.
        </footer>
      </div>
    </div>
  );
}
