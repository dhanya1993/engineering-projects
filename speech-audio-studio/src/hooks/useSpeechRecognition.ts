import { useCallback, useEffect, useRef, useState } from "react";

export type RecognitionStatus = "idle" | "listening" | "unsupported" | "error";

function getRecognitionCtor(): SpeechRecognitionStatic | undefined {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

/**
 * Wraps the Web Speech API's SpeechRecognition with a fix for a real bug
 * class it ships with: calling start() while a recognition session is
 * already active (or mid-teardown) throws an InvalidStateError, and the
 * browser's own onend/onstart events fire asynchronously enough that a
 * fast double-click on a "Start" button reliably triggers it. This is
 * the same session-locking issue fixed in the production speech module —
 * this hook guards it with an explicit `sessionLockRef` rather than
 * relying on React state (which updates too late for this race).
 */
export function useSpeechRecognition() {
  const [status, setStatus] = useState<RecognitionStatus>(
    getRecognitionCtor() ? "idle" : "unsupported"
  );
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const sessionLockRef = useRef(false);
  const intentionalStopRef = useRef(false);
  // Tracks intent rather than reading React state inside the onend
  // closure below — the closure is created once in the effect and would
  // otherwise see a stale `status` value from the initial render.
  const wantsListeningRef = useRef(false);

  useEffect(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalChunk = "";
      let interimChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) finalChunk += text;
        else interimChunk += text;
      }
      if (finalChunk) setTranscript((prev) => (prev ? `${prev} ${finalChunk}`.trim() : finalChunk));
      setInterimTranscript(interimChunk);
    };

    recognition.onerror = (event) => {
      // "no-speech" fires constantly on quiet mics — it's not a real
      // error, so don't surface it as one.
      if (event.error === "no-speech") return;
      setError(`Recognition error: ${event.error}`);
      setStatus("error");
      sessionLockRef.current = false;
    };

    recognition.onend = () => {
      sessionLockRef.current = false;
      // Some browsers end a session on their own after a period of
      // silence even with continuous=true. If the user never asked us
      // to stop, restart transparently instead of leaving the UI
      // showing "listening" while nothing is actually happening.
      if (!intentionalStopRef.current && wantsListeningRef.current) {
        try {
          sessionLockRef.current = true;
          recognition.start();
        } catch {
          setStatus("idle");
          wantsListeningRef.current = false;
        }
      } else {
        setStatus("idle");
        wantsListeningRef.current = false;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      intentionalStopRef.current = true;
      recognition.abort();
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    // The actual session-lock: refuse to call start() again if a
    // session is already active or mid-startup, instead of letting the
    // browser throw.
    if (sessionLockRef.current) return;

    setError(null);
    setTranscript("");
    setInterimTranscript("");
    intentionalStopRef.current = false;
    wantsListeningRef.current = true;

    try {
      sessionLockRef.current = true;
      recognition.start();
      setStatus("listening");
    } catch {
      sessionLockRef.current = false;
      setError("Couldn't start speech recognition — try again in a moment.");
      setStatus("error");
    }
  }, []);

  const stop = useCallback(() => {
    intentionalStopRef.current = true;
    wantsListeningRef.current = false;
    recognitionRef.current?.stop();
  }, []);

  return { status, transcript, interimTranscript, error, start, stop };
}
