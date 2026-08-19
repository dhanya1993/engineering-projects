import { useCallback, useRef, useState } from "react";
import { Audio } from "expo-av";

export type RecorderState = "idle" | "recording" | "recorded" | "playing";

/**
 * Thin wrapper around expo-av's Audio.Recording/Sound. Handles the
 * permission request, sets the correct audio mode for recording on both
 * platforms (iOS silently fails to record without
 * allowsRecordingIOS: true), and cleans up the previous Sound instance
 * before creating a new one — a missed unloadAsync() is a common source
 * of leaked native audio sessions in RN apps.
 */
export function useVoiceRecorder() {
  const [state, setState] = useState<RecorderState>("idle");
  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setError("Microphone permission is required to record a voice note.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setState("recording");
    } catch {
      setError("Couldn't start recording.");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    const recording = recordingRef.current;
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const recordedUri = recording.getURI();
      setUri(recordedUri);
      setState("recorded");
    } catch {
      setError("Couldn't finish recording.");
    } finally {
      recordingRef.current = null;
    }
  }, []);

  const play = useCallback(async (playUri: string) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync({ uri: playUri });
      soundRef.current = sound;
      setState("playing");
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setState("recorded");
        }
      });
      await sound.playAsync();
    } catch {
      setError("Couldn't play back the recording.");
    }
  }, []);

  const reset = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setUri(null);
    setState("idle");
    setError(null);
  }, []);

  return { state, uri, error, startRecording, stopRecording, play, reset };
}
