import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechStatus = "idle" | "speaking" | "paused" | "unsupported";

/**
 * Wraps window.speechSynthesis. The classic cross-browser gotcha here:
 * getVoices() often returns an empty array on first call because voice
 * lists load asynchronously (especially on Chrome) — you have to listen
 * for the voiceschanged event and re-read the list once it fires, or
 * your voice picker silently stays empty.
 */
export function useTextToSpeech() {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [status, setStatus] = useState<SpeechStatus>(supported ? "idle" : "unsupported");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length > 0) setVoices(list);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [supported]);

  const speak = useCallback(
    (text: string, options?: { voiceURI?: string; rate?: number; pitch?: number }) => {
      if (!supported || !text.trim()) return;

      window.speechSynthesis.cancel(); // clear any queued/interrupted utterance first

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.voiceURI === options?.voiceURI);
      if (voice) utterance.voice = voice;
      utterance.rate = options?.rate ?? 1;
      utterance.pitch = options?.pitch ?? 1;

      utterance.onstart = () => setStatus("speaking");
      utterance.onpause = () => setStatus("paused");
      utterance.onresume = () => setStatus("speaking");
      utterance.onend = () => setStatus("idle");
      utterance.onerror = () => setStatus("idle");

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [supported, voices]
  );

  const pause = useCallback(() => {
    if (supported) window.speechSynthesis.pause();
  }, [supported]);

  const resume = useCallback(() => {
    if (supported) window.speechSynthesis.resume();
  }, [supported]);

  const cancel = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
    setStatus("idle");
  }, [supported]);

  return { status, voices, speak, pause, resume, cancel };
}
