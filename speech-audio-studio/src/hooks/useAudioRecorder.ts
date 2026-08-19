import { useCallback, useRef, useState } from "react";

export type RecorderStatus = "idle" | "recording" | "paused" | "stopped" | "error";

export interface AudioRecording {
  url: string;
  blob: Blob;
  mimeType: string;
  durationMs: number;
}

// Browsers disagree wildly on which container/codec a MediaRecorder can
// produce. Safari (especially iOS) only accepts a narrow subset and will
// throw if you hand it a mimeType Chrome would happily use — this is the
// same cross-device fix required for browser-based recording in
// production (Lingotran Web's iOS Safari MIME-type issue). We probe a
// preference list and use the first one the browser actually supports.
const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/aac",
  "audio/ogg;codecs=opus"
];

function pickSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type));
}

export function useAudioRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [recording, setRecording] = useState<AudioRecording | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setRecording(null);
    chunksRef.current = [];

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("This browser doesn't support microphone recording.");
      setStatus("error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = pickSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream); // last-resort: let the browser pick

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const finalMimeType = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: finalMimeType });
        const url = URL.createObjectURL(blob);
        setRecording({ url, blob, mimeType: finalMimeType, durationMs: Date.now() - startTimeRef.current });
        cleanupStream();
        stopTimer();
      };

      recorder.onerror = () => {
        setError("Recording failed unexpectedly. Please try again.");
        setStatus("error");
        cleanupStream();
        stopTimer();
      };

      mediaRecorderRef.current = recorder;
      startTimeRef.current = Date.now();
      recorder.start(250); // collect chunks every 250ms so pause/stop is responsive
      setStatus("recording");
      setElapsedMs(0);
      timerRef.current = window.setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 200);
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone access was denied. Check your browser's site permissions."
          : "Couldn't access the microphone.";
      setError(message);
      setStatus("error");
    }
  }, [cleanupStream, stopTimer]);

  const stop = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setStatus("stopped");
  }, []);

  const pause = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setStatus("paused");
      stopTimer();
    }
  }, [stopTimer]);

  const resume = useCallback(() => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setStatus("recording");
      timerRef.current = window.setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 200);
    }
  }, []);

  const reset = useCallback(() => {
    if (recording) URL.revokeObjectURL(recording.url);
    setRecording(null);
    setStatus("idle");
    setElapsedMs(0);
    setError(null);
  }, [recording]);

  return { status, recording, error, elapsedMs, start, stop, pause, resume, reset };
}
